// components/ui/Animations/Background.tsx — THE SKY OF ASGARD
"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Stars, 
  Cloud, 
  Float, 
  Environment,
  PerspectiveCamera 
} from "@react-three/drei";
import { Mjolnir3D } from "./Mjolnir3D";
import { useScroll } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Background() {
  const { scrollYProgress } = useScroll();
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={canvasRef}
      className="fixed inset-0 -z-10 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 70 }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Subtle starfield */}
        <Stars 
          radius={150} 
          depth={60} 
          count={6000} 
          factor={5} 
          saturation={0} 
          fade 
          speed={1} 
        />

        {/* Floating clouds — barely visible, just atmosphere */}
        <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
          <Cloud 
            opacity={0.08} 
            speed={0.4} 
            bounds={[20, 5, 5]} 
            segments={30} 
          />
        </Float>

        {/* Ambient + directional light */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#00f0ff" />

        {/* THE HAMMER */}
        <Mjolnir3D scrollProgress={scrollYProgress} />

        {/* Optional: <Environment preset="night" /> */}
      </Canvas>

      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90 pointer-events-none" />
      
      {/* Subtle electric mist */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-amber-500/10 animate-pulse" />
      </div>
    </div>
  );
}