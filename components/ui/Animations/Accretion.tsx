// components/mjolnirui/backgrounds/accretion/Accretion.tsx
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type AccretionProps = {
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  turbulence?: number;
  depth?: number;
  brightness?: number;
  colorShift?: number;
};

export default function Accretion({
  className,
  style,
  speed = 1.0,
  turbulence = 1.2,
  depth = 1.0,
  brightness = 1.1,
  colorShift = 1.0,
}: AccretionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      u_speed: { value: speed },
      u_turbulence: { value: turbulence },
      u_depth: { value: depth },
      u_brightness: { value: brightness },
      u_colorShift: { value: colorShift },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec3 iResolution;
        uniform float u_speed;
        uniform float u_turbulence;
        uniform float u_depth;
        uniform float u_brightness;
        uniform float u_colorShift;

        vec4 tanhApprox(vec4 x) {
          vec4 x2 = x * x;
          return x * (3.0 + x2) / (3.0 + 3.0 * x2);
        }

        void mainImage(out vec4 O, vec2 I) {
          float z = 0.0, d, i = 0.0;
          O = vec4(0.0);
          for(float step = 0.0; step < 20.0; step++) {
            i = step;
            vec3 p = z * normalize(vec3(I + I, 0) - iResolution.xyx) + 0.1 * u_depth;
            p = vec3(atan(p.y / 0.2, p.x) * 2.0, p.z / 3.0, length(p.xy) - 5.0 - z * 0.2);
            for(float turb = 0.0; turb < 7.0; turb++) {
              p += sin(p.yzx * (turb + 1.0) + iTime * u_speed + 0.3 * i * u_turbulence) / (turb + 1.0);
            }
            d = length(vec4(0.4 * cos(p) - 0.4, p.z));
            z += d;
            vec4 color = (1.0 + cos(p.x + i * 0.4 + z + vec4(6, 1, 2, 0) * u_colorShift)) / d;
            O += color * u_brightness;
          }
          O = tanhApprox(O * O / 400.0);
        }

        varying vec2 vUv;
        void main() {
          mainImage(gl_FragColor, vUv * iResolution.xy);
        }
      `,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.iResolution.value.set(width, height, 1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [speed, turbulence, depth, brightness, colorShift]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className || ""}`}
      style={{ background: "black", ...style }}
    />
  );
}