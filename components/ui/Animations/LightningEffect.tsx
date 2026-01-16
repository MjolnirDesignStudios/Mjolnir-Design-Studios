// components/ui/Animations/LightningEffect.tsx — Optimized & Error-Free
"use client";

import React, { useEffect, useRef, useState } from "react";

interface LightningEffectProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
  className?: string;
}

const LightningEffect: React.FC<LightningEffectProps> = ({
  hue = 230,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastTime = useRef(performance.now());
  const startTime = useRef(performance.now());

  // Intersection Observer — only run when visible
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const initWebGL = () => {
      gl = canvas.getContext("webgl", { alpha: true, antialias: false });
      if (!gl) return false;

      const vsSource = `
        attribute vec2 aPosition;
        void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
      `;

      const fsSource = `
        precision highp float;
        uniform vec2 iResolution;
        uniform float iTime;
        uniform float uHue;
        uniform float uXOffset;
        uniform float uSpeed;
        uniform float uIntensity;
        uniform float uSize;

        #define OCTAVE_COUNT 8

        vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
        }

        float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }

        mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
            value += amplitude * noise(p);
            p *= rotate2d(0.45);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;

          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          fragColor = vec4(col, 1.0);
        }

        void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
        }
      `;

      const compileShader = (type: number, source: string): WebGLShader | null => {
        const shader = gl!.createShader(type);
        if (!shader) return null;
        gl!.shaderSource(shader, source);
        gl!.compileShader(shader);
        if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
          console.warn("Shader compile error:", gl!.getShaderInfoLog(shader));
          gl!.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compileShader(gl.VERTEX_SHADER, vsSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return false;

      const program = gl!.createProgram();
      if (!program) return false;

      gl!.attachShader(program, vs);
      gl!.attachShader(program, fs);
      gl!.linkProgram(program);

      if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
        console.warn("Program link error:", gl!.getProgramInfoLog(program));
        return false;
      }

      gl!.useProgram(program);

      // Fullscreen quad
      const buffer = gl!.createBuffer();
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
      gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl!.STATIC_DRAW);

      const pos = gl!.getAttribLocation(program, "aPosition");
      gl!.enableVertexAttribArray(pos);
      gl!.vertexAttribPointer(pos, 2, gl!.FLOAT, false, 0, 0);

      // Safe uniform lookup with null checks
      const getUniform = (name: string) => gl!.getUniformLocation(program, name);

      const uniforms = {
        iResolution: getUniform("iResolution"),
        iTime: getUniform("iTime"),
        uHue: getUniform("uHue"),
        uXOffset: getUniform("uXOffset"),
        uSpeed: getUniform("uSpeed"),
        uIntensity: getUniform("uIntensity"),
        uSize: getUniform("uSize"),
      };

      // Only proceed if all critical uniforms exist
      if (!uniforms.iResolution || !uniforms.iTime) {
        console.warn("Missing critical uniforms");
        return false;
      }

      // Store uniforms in closure
      (window as any)._lightningUniforms = uniforms;

      return true;
    };

    const render = () => {
      if (!gl || !canvasRef.current) return;

      resizeCanvas();

      const currentTime = performance.now();
      if (currentTime - lastTime.current < 33) { // ~30 FPS
        animationId.current = requestAnimationFrame(render);
        return;
      }
      lastTime.current = currentTime;

      const time = (currentTime - startTime.current) / 1000;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const u = (window as any)._lightningUniforms;
      if (u) {
        gl.uniform2f(u.iResolution, canvas.width, canvas.height);
        gl.uniform1f(u.iTime, time);
        gl.uniform1f(u.uHue, hue);
        gl.uniform1f(u.uXOffset, xOffset);
        gl.uniform1f(u.uSpeed, speed);
        gl.uniform1f(u.uIntensity, intensity);
        gl.uniform1f(u.uSize, size);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId.current = requestAnimationFrame(render);
    };

    if (!initWebGL()) {
      // CSS fallback
      canvas.style.background = "radial-gradient(circle at 50% 0%, #00f0ff11 0%, transparent 70%)";
      canvas.style.animation = "lightning-pulse 8s infinite ease-in-out";
      if (!document.getElementById("lightning-pulse-style")) {
        const style = document.createElement("style");
        style.id = "lightning-pulse-style";
        style.textContent = `
          @keyframes lightning-pulse {
            0%, 100% { opacity: 0.15; }
            5%, 18% { opacity: 0.4; }
            10% { opacity: 0.25; }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      render();
    }

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);
    resizeCanvas();

    const handleVisibility = () => {
      if (document.hidden) {
        if (animationId.current) cancelAnimationFrame(animationId.current);
      } else if (isVisible) {
        render();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isVisible, hue, xOffset, speed, intensity, size]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className || ""}`}
    />
  );
};

export default LightningEffect;