"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

type SingularityProps = {
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  intensity?: number;
  size?: number;
  waveStrength?: number;
  colorShift?: number;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float iTime;
  uniform vec3 iResolution;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_size;
  uniform float u_waveStrength;
  uniform float u_colorShift;

  void mainImage(out vec4 O, vec2 F) {
    float i = .2 * u_speed, a;
    vec2 r = iResolution.xy,
         p = (F + F - r) / r.y / (.7 * u_size),
         d = vec2(-1, 1),
         b = p - i * d,
         c = p * mat2(1, 1, d / (.1 + i / dot(b, b))),
         v = c * mat2(cos(.5 * log(a = dot(c, c)) + iTime * i * u_speed + vec4(0, 33, 11, 0))) / i,
         w = vec2(0.0);
    
    for(float j = 0.0; j < 9.0; j++) {
      i++;
      w += 1.0 + sin(v * u_waveStrength);
      v += .7 * sin(v.yx * i + iTime * u_speed) / i + .5;
    }
    
    i = length(sin(v / .3) * .4 + c * (3. + d));
    vec4 colorGrad = vec4(.6, -.4, -1, 0) * u_colorShift;
    O = 1. - exp(-exp(c.x * colorGrad) / w.xyyx / (2. + i * i / 4. - i) / (.5 + 1. / a) / (.03 + abs(length(p) - .7)) * u_intensity);
  }

  varying vec2 vUv;
  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
`;

export default function Singularity({
  className,
  style,
  speed = 1.0,
  intensity = 1.2,
  size = 1.1,
  waveStrength = 1.0,
  colorShift = 1.0,
}: SingularityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current; // Store the ref value

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      u_speed: { value: speed },
      u_intensity: { value: intensity },
      u_size: { value: size },
      u_waveStrength: { value: waveStrength },
      u_colorShift: { value: colorShift },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.iResolution.value.set(width, height, 1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (rendererRef.current?.domElement?.parentNode) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [speed, intensity, size, waveStrength, colorShift]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className || ""}`}
      style={{ background: "black", ...style }}
    />
  );
}