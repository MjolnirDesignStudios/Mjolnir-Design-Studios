// data/tech-icons.ts
// This file imports concrete react-icons components.
// Separated from data/index.ts to keep the shared data module SSR-safe.
// DO NOT import this file from server components or API routes.
//
// NOTE: The spec architecture diagram shows techStackIcons in data/index.ts,
// but the spec body text (and SSR safety requirements) place it here.
// This is the intentional resolution of that contradiction.

import type { TechIcon } from "@/data/index";

export const techStackIcons: TechIcon[] = [
  // ── Core Web ────────────────────────────────────────────────────────────
  { name: "React",         svgPath: "/Icons/Technologies/react.svg" },
  { name: "Next.js",       svgPath: "/Icons/Technologies/nextjs.svg" },
  { name: "TypeScript",    svgPath: "/Icons/Technologies/typescript.svg" },
  { name: "JavaScript",    svgPath: "/Icons/Technologies/javascript.svg" },
  { name: "HTML5",         svgPath: "/Icons/Technologies/html.svg" },
  { name: "CSS3",          svgPath: "/Icons/Technologies/css.svg" },
  { name: "Tailwind",      svgPath: "/Icons/Technologies/tail.svg" },
  // ── Animation / 3D ──────────────────────────────────────────────────────
  { name: "GSAP",          svgPath: "/Icons/Technologies/gsap.svg" },
  { name: "Three.js",      svgPath: "/Icons/Technologies/threejs.svg" },
  { name: "Framer Motion", svgPath: "/Icons/Technologies/fm.svg" },
  { name: "Blender",       svgPath: "/Icons/Technologies/blend.svg" },
  { name: "Bambu Lab",     svgPath: "/Icons/Technologies/bambulab.svg" },
  // ── Backend / Runtime ───────────────────────────────────────────────────
  { name: "Node.js",       svgPath: "/Icons/Technologies/nodejs.svg" },
  { name: "Python",        svgPath: "/Icons/Technologies/python.svg" },
  { name: "C",             svgPath: "/Icons/Technologies/c.svg" },
  // ── Data / Infra ────────────────────────────────────────────────────────
  { name: "Supabase",      svgPath: "/Icons/Technologies/supabase.svg" },
  { name: "PostgreSQL",    svgPath: "/Icons/Technologies/postgresql.svg" },
  { name: "Docker",        svgPath: "/Icons/Technologies/docker.svg" },
  { name: "Cloudflare",    svgPath: "/Icons/Technologies/cloudflare.svg" },
  // ── Payments / Commerce ─────────────────────────────────────────────────
  { name: "Stripe",        svgPath: "/Icons/Payments/stripe-64.svg" },
  { name: "Coinbase",      svgPath: "/Icons/Payments/coinbase-64.svg" },
  { name: "Uphold",        svgPath: "/Icons/Payments/uphold-64.svg" },
  // ── Platform / Hosting ──────────────────────────────────────────────────
  { name: "Vercel",        svgPath: "/vercel.svg" },
  { name: "Hostinger",     svgPath: "/Icons/Technologies/host.svg" },
  { name: "GitHub",        svgPath: "/Icons/Technologies/github.svg" },
  { name: "Replit",        svgPath: "/Icons/Technologies/replit.svg" },
  // ── AI / ML ─────────────────────────────────────────────────────────────
  { name: "Claude",        svgPath: "/Icons/Technologies/claude.svg" },
  { name: "Grok",          svgPath: "/Icons/Technologies/grok.svg" },
  { name: "Ollama",        svgPath: "/Icons/Technologies/ollama.svg" },
  // ── SaaS / Tools ────────────────────────────────────────────────────────
  { name: "Figma",         svgPath: "/Icons/Technologies/figma.svg" },
  { name: "HubSpot",       svgPath: "/Icons/Technologies/hubspot.svg" },
  { name: "Calendly",      svgPath: "/Icons/Technologies/calendly.svg" },
  { name: "ElevenLabs",    svgPath: "/Icons/Technologies/elevenlabs.svg" },
  { name: "Stream",        svgPath: "/Icons/Technologies/stream.svg" },
  { name: "App",           svgPath: "/Icons/Technologies/app.svg" },
];
