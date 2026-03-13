/**
 * OdinAI Skill: image_to_hd_lowpoly_3d_armor
 * Category: Asset Generation / 3D Content Pipeline / Character & Prop Creation
 *
 * Takes a 2D rendered character/armor image, removes background, stylizes it
 * into ultra-sharp low-poly aesthetic, then uses Meshy.ai to produce a
 * game-ready 3D model with PBR textures.
 *
 * Target pipelines: game engines (Unity/Unreal), 3D printing, NFT/collectibles.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArmorSkillInput {
  /** Image URL, file path, or base64-encoded image string */
  image: string;
  /** Optional style refinement for the stylization + Meshy prompt */
  style_prompt?: string;
  /** Target polycount range for the 3D model */
  target_polycount?: "low" | "medium-high" | "high";
  /** Directory to write output files into */
  output_dir?: string;
}

export interface ArmorSkillOutput {
  /** Path or URL to the cleaned, background-removed PNG */
  subject_clean_png: string;
  /** Path or URL to the low-poly stylized PNG fed to Meshy */
  subject_lowpoly_png: string;
  /** Path or URL to the downloaded .glb (embedded textures) */
  model_glb: string;
  /** Path or URL to the downloaded .fbx */
  model_fbx: string;
  /** Folder containing unpacked PBR textures (albedo, metallic-roughness, normal, emissive) */
  textures_dir: string;
  /** Structured metadata about the generation run */
  metadata: ArmorSkillMetadata;
}

export interface ArmorSkillMetadata {
  input_image_hash: string;
  style_prompt_used: string;
  meshy_job_id: string;
  polycount_estimated: number;
  generation_time_ms: number;
  created_at: string; // ISO timestamp
}

// ─── Quality Gate ─────────────────────────────────────────────────────────────

export interface QualityGateResult {
  passed: boolean;
  issues: string[];
  /** Auto-retry hint if failed */
  retry_suggestion?: string;
}

// ─── Skill Definition ─────────────────────────────────────────────────────────

export const SKILL_ID = "image_to_hd_lowpoly_3d_armor" as const;

export const SKILL_DEFINITION = {
  id: SKILL_ID,
  name: "Image-to-3D Game-Ready Armor Model Generator",
  version: "1.0.0",
  category: "Asset Generation / 3D Content Pipeline",
  description:
    "Converts a 2D armor/character render into a production-quality, game-ready 3D model " +
    "with PBR textures via background removal → low-poly stylization → Meshy.ai Image-to-3D.",

  /** Ideal input: front-facing, well-lit, high-contrast, isolated subject */
  input_schema: {
    image: { type: "string", required: true, description: "URL / path / base64 image" },
    style_prompt: { type: "string", required: false },
    target_polycount: { type: "string", enum: ["low", "medium-high", "high"], default: "medium-high" },
    output_dir: { type: "string", required: false, default: "./generated_assets" },
  },

  output_schema: {
    subject_clean_png: "string",
    subject_lowpoly_png: "string",
    model_glb: "string",
    model_fbx: "string",
    textures_dir: "string",
    metadata: "ArmorSkillMetadata",
  },

  /** APIs and services required at runtime */
  required_services: [
    {
      id: "meshy",
      env_key: "MESHY_API_KEY",
      description: "Meshy.ai Image-to-3D generation (primary)",
      fallbacks: ["triposr", "luma_genie"],
    },
    {
      id: "rembg",
      env_key: null,
      description: "Background removal — rembg Python lib or Clipdrop API",
      fallbacks: ["clipdrop", "segment_anything"],
    },
    {
      id: "stylization",
      env_key: null,
      description: "Low-poly stylization — SD img2img + ControlNet, or Flux.1 img2img",
      fallbacks: ["internal_shader"],
    },
  ],

  success_criteria: [
    "Transparent-background clean input delivered to Meshy",
    "Model topology is recognizable (chest plate, shoulders, gauntlets visible)",
    "No merged limbs or fused geometry",
    "Glowing / energy parts have emissive texture channel",
    "Full pipeline completes in < 5 minutes",
  ],
} as const;

// ─── Execution Steps (agent workflow) ─────────────────────────────────────────

/**
 * STEP 1 — Image Validation & Pre-processing
 *
 * - Accept image input (URL / upload / base64)
 * - Warn + upscale if resolution < 1024×1024
 * - Detect main subject via segmentation
 */
export const STEP_1_VALIDATE = {
  id: "validate_image",
  label: "Image Validation & Pre-processing",
  min_resolution: { width: 1024, height: 1024 },
  upscale_if_below: true,
  subject_detection_tool: "rembg | SAM | Clipdrop",
} as const;

/**
 * STEP 2 — Background Removal
 *
 * - Isolate subject on transparent (#0000) background
 * - Save intermediate: subject_clean.png
 * - Tool priority: rembg → transparent-background model → Clipdrop API
 */
export const STEP_2_REMOVE_BG = {
  id: "remove_background",
  label: "Background Removal",
  output_file: "subject_clean.png",
  tool_priority: ["rembg", "transparent_bg_model", "clipdrop_api"],
  background_color: "#00000000",
} as const;

/**
 * STEP 3 — Low-Poly / Ultra-HD Stylization
 *
 * - Apply low-poly filter preserving sharp facets and glowing accents
 * - Enhance sharpness, contrast, metallic look
 * - Save intermediate: subject_lowpoly_stylized.png
 */
export const STEP_3_STYLIZE = {
  id: "stylize_lowpoly",
  label: "Low-Poly / Ultra-HD Stylization",
  output_file: "subject_lowpoly_stylized.png",
  technique_chain: [
    "edge_aware_smoothing_and_posterization",
    "triangulation_lowpoly_shader",
    "controlnet_lowpoly_lora",           // Stable Diffusion path
    "sharpness_contrast_metallic_boost",
  ],
  default_prompt:
    "ultra sharp low poly Iron Man armor, faceted metallic surfaces, " +
    "glowing blue accents, clean studio lighting, high definition",
  style_keywords: ["low-poly", "game-ready", "metallic", "faceted", "glowing"],
} as const;

/**
 * STEP 4 — Meshy.ai Image-to-3D Generation
 *
 * - Upload stylized PNG to Meshy Image-to-3D endpoint
 * - Poll for completion, then download .glb + .fbx + textures zip
 */
export const STEP_4_MESHY = {
  id: "meshy_image_to_3d",
  label: "Meshy.ai Image-to-3D Generation",
  endpoint: "https://api.meshy.ai/v2/image-to-3d",
  recommended_settings: {
    model_style: "production",
    polycount_target: { low: "5k-20k", "medium-high": "20k-80k", high: "80k+" },
    texturing: "pbr_high_resolution",
    quad_remesh: true,
  },
  default_prompt:
    "futuristic sci-fi armor suit, metallic chrome and titanium, " +
    "glowing blue energy accents, highly detailed facets, clean topology",
  timeout_ms: 120_000,
  poll_interval_ms: 5_000,
  output_formats: ["glb", "fbx"],
  texture_maps: ["albedo", "metallic_roughness", "normal", "emissive"],
  fallback_services: ["triposr", "luma_genie", "threedy_ai"],
} as const;

/**
 * STEP 5 — Post-Processing & Quality Gate
 *
 * Autonomous refinement loop:
 * - Check for floating geometry, artifact-heavy areas, UVs, polycount
 * - If quality low → regenerate with adjusted prompt / seed / remesh strength
 * - Optional: auto-rig via Mixamo API / RigNet for full character
 */
export const STEP_5_QA = {
  id: "quality_gate",
  label: "Post-Processing & Quality Gate",
  checks: [
    "no_floating_parts",
    "no_major_artifacts",
    "uvs_reasonable",
    "polycount_in_target_range",
  ],
  max_auto_retries: 3,
  auto_rig_if_full_character: false, // Opt-in; requires Mixamo API key
} as const;

/**
 * STEP 6 — Packaging & Export
 *
 * Bundle all outputs into output_dir:
 *   final_model.glb
 *   final_model.fbx
 *   textures/  (albedo, metallic-roughness, normal, emissive)
 *   stylized_2d.png
 *   metadata.json
 */
export const STEP_6_PACKAGE = {
  id: "package_export",
  label: "Packaging & Export",
  bundle_files: [
    "final_model.glb",
    "final_model.fbx",
    "textures/albedo.png",
    "textures/metallic_roughness.png",
    "textures/normal.png",
    "textures/emissive.png",
    "stylized_2d.png",
    "metadata.json",
  ],
  optional_extras: ["360_preview_render.png", "turnaround.gif"],
} as const;

// ─── Failure Modes & Recovery ─────────────────────────────────────────────────

export const FAILURE_RECOVERY = {
  poor_segmentation: "Add manual mask hint or retry with a different background-removal model",
  meshy_low_quality: "Increase guidance scale, add negative prompt, retry with different seed",
  generation_timeout: "Fallback to TripoSR or Luma Genie",
  model_too_high_poly: "Run quad-remesh pass (Meshy remesh or Blender script)",
  stylization_failure: "Fall back to internal low-poly edge-detection shader",
} as const;

// ─── Example Agent Invocation ──────────────────────────────────────────────────
//
//  odinAI.runSkill("image_to_hd_lowpoly_3d_armor", {
//    image: "https://example.com/ironman_render.png",
//    style_prompt: "ultra sharp low poly sci-fi armor, glowing blue reactor",
//    target_polycount: "medium-high",
//    output_dir: "./generated_assets/run_042",
//  });
//
// ─────────────────────────────────────────────────────────────────────────────
