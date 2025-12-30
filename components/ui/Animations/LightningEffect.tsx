// components/ui/Animations/LightningEffect.tsx — THE TRUE LIGHTNING, FIXED & ETERNAL
"use client";

import React, { useEffect, useRef } from "react";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId: number;
    let gl: WebGLRenderingContext | null = null;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    const initWebGL = () => {
      gl = canvas.getContext("webgl", { alpha: true, antialias: false });
      if (!gl) return false;

      const vsSource = `
        attribute vec2 aPosition;
        void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
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

        #define OCTAVE_COUNT 10

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

      const compileShader = (type: number, source: string) => {
        const shader = gl!.createShader(type)!;
        gl!.shaderSource(shader, source);
        gl!.compileShader(shader);
        if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
          console.warn("Shader error:", gl!.getShaderInfoLog(shader));
          gl!.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compileShader(gl.VERTEX_SHADER, vsSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return false;

      const program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn("Program link error");
        return false;
      }

      gl.useProgram(program);

      // Fullscreen quad
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

      const pos = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const uniforms = {
        iResolution: gl.getUniformLocation(program, "iResolution")!,
        iTime: gl.getUniformLocation(program, "iTime")!,
        uHue: gl.getUniformLocation(program, "uHue")!,
        uXOffset: gl.getUniformLocation(program, "uXOffset")!,
        uSpeed: gl.getUniformLocation(program, "uSpeed")!,
        uIntensity: gl.getUniformLocation(program, "uIntensity")!,
        uSize: gl.getUniformLocation(program, "uSize")!,
      };

      let start = performance.now();

      const render = () => {
        resizeCanvas();

        const time = (performance.now() - start) / 1000;

        if (!gl) return;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.iTime, time);
        gl.uniform1f(uniforms.uHue, hue);
        gl.uniform1f(uniforms.uXOffset, xOffset);
        gl.uniform1f(uniforms.uSpeed, speed);
        gl.uniform1f(uniforms.uIntensity, intensity);
        gl.uniform1f(uniforms.uSize, size);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationId = requestAnimationFrame(render);
      };

      render();
      return true;
    };

    // Try WebGL — if fails, fall back to CSS (no error)
    if (!initWebGL()) {
      canvas.style.background = "radial-gradient(circle at 50% 0%, #00f0ff11 0%, transparent 70%)";
      canvas.style.animation = "lightning-pulse 10s infinite ease-in-out";
      document.head.insertAdjacentHTML("beforeend", `
        <style>
          @keyframes lightning-pulse {
            0%, 100% { opacity: 0.15; }
            5%, 18% { opacity: 0.4; }
            10% { opacity: 0.25; }
          }
        </style>
      `);
    }

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);
    resizeCanvas();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [hue, xOffset, speed, intensity, size]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none${className ? ` ${className}` : ""}`}
    />
  );
};

export default LightningEffect;