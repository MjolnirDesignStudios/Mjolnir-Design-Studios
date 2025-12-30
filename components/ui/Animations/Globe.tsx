"use client";

import React, { useRef, useEffect } from "react";
import createGlobe from "cobe";
import clsx from "clsx";

interface GlobeProps {
  className?: string;
  dark?: boolean;
  baseColor?: string;
  markerColors?: string[];
  glowColor?: string;
  rings?: boolean;
  ringIntensity?: "subtle" | "normal" | "epic" | "godmode";
  opacity?: number;
  brightness?: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export default function Globe({
  className,
  dark = true,
  baseColor = "#777777",
  markerColors = ["#f59e0b"],
  glowColor = "#f8fafc",
  rings = true,
  ringIntensity = "epic",
  opacity = 0.88,
  brightness = 1.8,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);
  
  const pointerInteracting = useRef<number | null>(null);
  const pointerLastX = useRef<number | null>(null);

  // Stable deps — no more React warnings
  const deps = [
    dark,
    baseColor,
    markerColors.join(","),
    glowColor,
    opacity,
    brightness,
    scale,
    offsetX,
    offsetY,
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = canvasRef.current.offsetWidth;
    let phi = 0;

    const onResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.offsetWidth;
      if (globeRef.current) {
        globeRef.current.onResize?.(width);
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    try {
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.25,
        dark: dark ? 1 : 0,
        diffuse: 1.6,
        mapSamples: 30000,
        mapBrightness: brightness,
        baseColor: hexToRgb(baseColor),
        markerColor: hexToRgb(markerColors[0] || "#f59e0b"),
        glowColor: hexToRgb(glowColor),
        markers: [
          { location: [37.7749, -122.4194], size: 0.05 },
          { location: [40.7128, -74.006], size: 0.05 },
          { location: [51.5074, -0.1278], size: 0.05 },
          { location: [35.6762, 139.6503], size: 0.05 },
          { location: [25.7617, -80.1918], size: 0.08 },
          { location: [25.2048, 55.2708], size: 0.08 },
          { location: [30.2672, -97.7431], size: 0.06 },
          { location: [-23.5505, -46.6333], size: 0.06 },
          { location: [52.5200, 13.4050], size: 0.05 },
          { location: [1.3521, 103.8198], size: 0.06 },
        ],
        opacity,
        scale,
        offset: [offsetX, offsetY],
        onRender: (state: any) => {
          if (!pointerInteracting.current) {
            state.phi = phi;
            phi += 0.005;
          }
        },
      });
    } catch (err) {
      console.warn("COBE failed to initialize — likely SSR");
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (globeRef.current?.destroy) globeRef.current.destroy();
    };
  }, deps); // Stable array — no more warnings

  const primaryRing = markerColors[0] || "#f59e0b";
  const goldRing = "#FFD700";

  return (
    <div className={clsx("relative aspect-square overflow-visible", className)}>
      {/* GOLD RINGS + GREEN ARCS */}
      {rings && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 rounded-full border-8 border-yellow-500/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400/40 animate-ping" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-0 rounded-full border-2 border-yellow-300/60 animate-ping" style={{ animationDelay: "2s" }} />

          {/* Green Arcs */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-emerald-400 to-transparent opacity-60 animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-t from-emerald-400 to-transparent opacity-60 animate-pulse" style={{ animationDelay: "1.5s" }} />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-emerald-400 to-transparent opacity-60 animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-l from-emerald-400 to-transparent opacity-60 animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ cursor: pointerInteracting.current !== null ? "grabbing" : "grab" }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          pointerLastX.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null && pointerLastX.current !== null) {
            const delta = e.clientX - pointerLastX.current;
            globeRef.current?.onRotate?.(delta / 100);
            pointerLastX.current = e.clientX;
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          pointerLastX.current = null;
        }}
        onPointerLeave={() => {
          pointerInteracting.current = null;
          pointerLastX.current = null;
        }}
      />
    </div>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map(h => h + h).join("");
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => v / 255) as [number, number, number];
}