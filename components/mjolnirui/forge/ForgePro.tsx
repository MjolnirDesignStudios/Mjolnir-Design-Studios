// app/forge/page.tsx — THE MJÖLNIR FORGE: DIGITAL + PHYSICAL FABRICATION
"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll } from "framer-motion";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// 3D MJÖLNIR MODEL (your Meshy hammer)
function Mjolnir({ progress }: { progress: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { scene } = useLoader(GLTFLoader, "/models/mjolnir.glb");

  useFrame(() => {
    if (!mesh.current) return;
    const t = progress;
    mesh.current.position.x = gsap.utils.interpolate(-8, 8, t);
    mesh.current.position.y = gsap.utils.interpolate(5, -5, t);
    mesh.current.position.z = gsap.utils.interpolate(10, -10, t);
    mesh.current.rotation.y = t * Math.PI * 4;
    mesh.current.rotation.x = Math.sin(t * Math.PI) * 0.5;
  });

  return <primitive ref={mesh} object={scene} scale={1.5} />;
}

export default function ForgePro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = scrollYProgress.get();

  const handleForgePro = () => {
    setIsLoading(true);
    setResponse("⚡ Forging your creation with thunder and lightning...");
    setTimeout(() => {
      setResponse(`THE FORGE HAS SPOKEN:\n\nA fully responsive Next.js landing page with gold gradients, 3D Mjolnir hero, and XRPL wallet connect has been forged.\n\nReady for physical fabrication via Meshy → 3D print.\n\nSend to printer?`);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-black overflow-hidden py-32">
      {/* 3D CANVAS — MJÖLNIR FLIES THROUGH ON SCROLL */}
      <Canvas className="fixed inset-0 pointer-events-none">
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffcc00" />
        <Mjolnir progress={progress} />
        <Environment preset="night" />
      </Canvas>

      {/* SECTION HEADER — THUNDEROUS MJÖLNIR STYLE */}
      <div className="relative z-10 text-center mb-20">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6">
          The MjölnirUI <span className="text-gold">Forge</span>
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-400 max-w-4xl mx-auto">
          Speak your will. I shall forge it — digital or physical.
        </p>
      </div>

      {/* FORGE UI */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full"
        >
          {/* AGENT INPUT */}
          <div className="bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/20 p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleForgePro()}
                placeholder="Forge me a golden landing page... or a 3D-printed Mjolnir keychain"
                className="flex-1 px-8 py-6 bg-black/80 border border-white/20 rounded-2xl text-white placeholder-gold/60 focus:outline-none focus:border-gold transition text-lg"
              />
              <button
                onClick={handleForgePro}
                disabled={isLoading}
                className="px-12 py-6 bg-gradient-to-r from-gold to-yellow-600 rounded-2xl font-bold text-black hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl disabled:opacity-70 whitespace-nowrap"
              >
                {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : "FORGE"}
              </button>
            </div>

            {/* RESPONSE */}
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-10 bg-black/80 rounded-3xl border border-gold/40 text-gold font-mono text-lg leading-relaxed"
              >
                {response}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}