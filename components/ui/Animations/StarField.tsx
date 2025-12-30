"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

type StarFieldProps = {
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  mouseMode?: "hover" | "click";
};

export const StarField: React.FC<StarFieldProps> = ({
  className,
  style,
  speed = 1.0,
  hue = 40,  // Golden-orange hue
  saturation = 1.0,
  brightness = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Copy the ref value to a variable for cleanup
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      iHSV: { value: new THREE.Vector3(hue / 360, saturation, brightness) },
      iSpeed: { value: speed },
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
        uniform vec4 iMouse;
        uniform vec3 iHSV;
        uniform float iSpeed;

        #define iterations 17
        #define formuparam 0.53
        #define volsteps 20
        #define stepsize 0.1
        #define zoom 0.800
        #define tile 0.850
        #define brightness 0.0015
        #define darkmatter 0.300
        #define distfading 0.730
        #define saturation 0.850

        void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv=fragCoord.xy/iResolution.xy-.5;
          uv.y*=iResolution.y/iResolution.x;
          vec3 dir=vec3(uv*zoom,1.);
          float time=iTime*iSpeed+.25;

          float a1=.5+iMouse.x/iResolution.x*2.;
          float a2=.8+iMouse.y/iResolution.y*2.;
          mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
          mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
          dir.xz*=rot1;
          dir.xy*=rot2;
          vec3 from=vec3(1.,.5,0.5);
          from+=vec3(time*2.,time,-2.);
          from.xz*=rot1;
          from.xy*=rot2;
          
          float s=0.1,fade=1.;
          vec3 v=vec3(0.);
          for (int r=0; r<volsteps; r++) {
            vec3 p=from+s*dir*.5;
            p = abs(vec3(tile)-mod(p,vec3(tile*2.)));
            float pa,a=pa=0.;
            for (int i=0; i<iterations; i++) { 
              p=abs(p)/dot(p,p)-formuparam;
              a+=abs(length(p)-pa);
              pa=length(p);
            }
            float dm=max(0.,darkmatter-a*a*.001);
            a*=a*a;
            if (r>6) fade*=1.-dm;
            v+=fade;
            v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade;
            fade*=distfading;
            s+=stepsize;
          }
          v=mix(vec3(length(v)),v,saturation);
          fragColor = vec4(v*.01,1.);
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
      frameRef.current = requestAnimationFrame(animate);

      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container?.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [speed, hue, saturation, brightness]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className || ""}`}
      style={{ background: "black", ...style }}
    />
  );
}