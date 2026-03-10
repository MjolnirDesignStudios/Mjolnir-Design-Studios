// components/ui/shaders/ShaderCanvas.tsx
// R3F-powered WebGL shader renderer — renders any ShaderConfig as a fullscreen quad
"use client";

import React, { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ShaderLoader } from "./shader-loader";
import type { ShaderConfig } from "./shader-manager";

// R3F accepts plain { value: T } objects at runtime — THREE.Uniform class is not required
type UniformMap = Record<string, { value: unknown }>;

// ── Shared loader instance ────────────────────────────────────────────────────
const loader = new ShaderLoader();

// ── Inner mesh component ──────────────────────────────────────────────────────
function ShaderMesh({
  config,
  isPlaying,
}: {
  config: ShaderConfig;
  isPlaying: boolean;
}) {
  const { size } = useThree();

  // Build uniforms from the shader config — always include uTime + uResolution
  const uniforms = useMemo<UniformMap>(() => {
    const base: UniformMap = {
      uTime:        { value: 0 },
      uResolution:  { value: new THREE.Vector2(size.width, size.height) },
      // Shadertoy compatibility aliases
      u_time:       { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      iTime:        { value: 0 },
      iResolution:  { value: new THREE.Vector3(size.width, size.height, 1) },
    };

    // Merge shader-specific uniforms
    if (config.uniforms) {
      Object.entries(config.uniforms).forEach(([key, def]) => {
        const v = (def as { value: unknown }).value;
        if (Array.isArray(v)) {
          base[key] = {
            value:
              v.length === 2
                ? new THREE.Vector2(v[0] as number, v[1] as number)
                : v.length === 3
                ? new THREE.Vector3(v[0] as number, v[1] as number, v[2] as number)
                : new THREE.Vector4(v[0] as number, v[1] as number, v[2] as number, v[3] as number),
          };
        } else {
          base[key] = { value: v };
        }
      });
    }
    return base;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.name]);

  // Update resolution on resize
  useEffect(() => {
    if (uniforms.uResolution)
      (uniforms.uResolution.value as THREE.Vector2).set(size.width, size.height);
    if (uniforms.u_resolution)
      (uniforms.u_resolution.value as THREE.Vector2).set(size.width, size.height);
    if (uniforms.iResolution)
      (uniforms.iResolution.value as THREE.Vector3).set(size.width, size.height, 1);
  }, [size, uniforms]);

  // Animate time uniform every frame
  useFrame((state) => {
    if (!isPlaying) return;
    const t = state.clock.elapsedTime;
    if (uniforms.uTime)   uniforms.uTime.value   = t;
    if (uniforms.u_time)  uniforms.u_time.value  = t;
    if (uniforms.iTime)   uniforms.iTime.value   = t;
  });

  return (
    <mesh>
      {/* PlaneGeometry fills clip space: vertices at (-1,-1) to (1,1) */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={config.vertexShader}
        fragmentShader={config.fragmentShader}
        uniforms={uniforms as Record<string, THREE.IUniform>}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Async shader wrapper ──────────────────────────────────────────────────────
function AsyncShader({
  shaderId,
  isPlaying,
}: {
  shaderId: string;
  isPlaying: boolean;
}) {
  const [config, setConfig] = React.useState<ShaderConfig | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    setError(null);
    loader
      .loadShader(shaderId)
      .then(setConfig)
      .catch(() => setError(`Shader "${shaderId}" not found`));
  }, [shaderId]);

  if (error || !config) return null;
  return <ShaderMesh config={config} isPlaying={isPlaying} />;
}

// ── Public component ──────────────────────────────────────────────────────────
interface ShaderCanvasProps {
  shaderId: string;
  isPlaying?: boolean;
  className?: string;
}

export default function ShaderCanvas({
  shaderId,
  isPlaying = true,
  className = "",
}: ShaderCanvasProps) {
  return (
    <Canvas
      className={className}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      gl={{ antialias: false, alpha: false }}
      style={{ background: "#000" }}
    >
      {/* Orthographic camera + no lighting needed for fragment shaders */}
      <AsyncShader shaderId={shaderId} isPlaying={isPlaying} />
    </Canvas>
  );
}
