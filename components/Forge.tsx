// components/Forge.tsx — Mjolnir Forge Demo (Secure Version - Client-Side Only, API Key Removed)
"use client";

import React, { useEffect, useState, useRef } from "react";
import SceneClient from "@/components/three/SceneClient";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import ForgePromptBar from "@/components/mjolnirui/forge/ForgePromptBar";
import { Download, AlertCircle } from "lucide-react";

export default function ForgeDemo() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    gsap.fromTo(
      ".forge-data-box",
      { x: 200, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        delay: 0.8,
        ease: "power3.out",
      }
    );
  }, []);

  const startMeshyGeneration = async (prompt: string) => {
    setError(null);
    setProgress(0);

    try {
      // Step 1: Start Preview Task via your secure server route
      const previewRes = await fetch("/api/meshy/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "preview",
          prompt,
          art_style: "realistic",
          should_remesh: true,
        }),
      });

      if (!previewRes.ok) {
        const errData = await previewRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to start preview task");
      }

      const previewData = await previewRes.json();
      const previewTaskId = previewData.result;

      // Step 2: Poll Preview Task
      const pollPreview = async () => {
        const res = await fetch(`/api/meshy/status/${previewTaskId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Preview polling failed");

        setProgress(data.progress || 0);

        if (data.status === "SUCCEEDED") {
          // Step 3: Start Refine Task
          const refineRes = await fetch("/api/meshy/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "refine",
              preview_task_id: previewTaskId,
              enable_pbr: true,
            }),
          });

          if (!refineRes.ok) {
            const errData = await refineRes.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to start refine task");
          }

          const refineData = await refineRes.json();
          const refineTaskId = refineData.result;

          // Step 4: Poll Refine Task
          const pollRefine = async () => {
            const res = await fetch(`/api/meshy/status/${refineTaskId}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Refine polling failed");

            setProgress(data.progress || 0);

            if (data.status === "SUCCEEDED") {
              const glbUrl = data.model_urls?.glb;
              if (glbUrl) setModelUrl(glbUrl);
              setIsLoading(false);
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            } else if (data.status === "FAILED") {
              throw new Error("Model generation failed");
            }
          };

          pollIntervalRef.current = setInterval(pollRefine, 4000);
        } else if (data.status === "FAILED") {
          throw new Error("Preview generation failed");
        }
      };

      pollIntervalRef.current = setInterval(pollPreview, 4000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setIsLoading(false);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setModelUrl(null);
    setProgress(0);
    await startMeshyGeneration(input);
    setInput("");
  };

  const handleVoice = () => {
    setInput("Create a glowing Mjolnir hammer");
  };

  const handleSave = () => {
    if (!modelUrl) return;
    const link = document.createElement("a");
    link.href = modelUrl;
    link.download = "forged-model.glb";
    link.click();
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  return (
    <section id="forge-demo" className="relative min-h-screen bg-neutral-950 overflow-hidden mb-10">
      <div className="flex flex-col">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center py-10"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
              The Mjolnir <span className="text-gold">Forge</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mt-4">
              Speak, and it shall be forged.
            </p>
          </motion.div>

          {/* Canvas - ALL ORIGINAL DIMENSIONS & STYLES PRESERVED */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="w-3/4 h-[40vh] max-h-[70vh] relative rounded-3xl overflow-hidden border-4 border-gold shadow-2xl shadow-gold/20 mb-12 align-items-center mx-auto"
          >
            <SceneClient modelUrl={modelUrl} />

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl" />
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-6">
                <div className="w-32 h-32 border-8 border-gold/30 border-t-gold rounded-full animate-spin" />
                <p className="text-2xl text-gold font-bold">Forging... {progress}%</p>
              </div>
            )}

            {/* Error Overlay */}
            {error && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-8">
                <div className="bg-red-900/80 border border-red-500 rounded-2xl p-6 max-w-md text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-white text-lg">{error}</p>
                </div>
              </div>
            )}

            {/* Download Button - only when model is ready */}
            {modelUrl && !isLoading && (
              <button
                onClick={handleSave}
                className="absolute bottom-6 right-6 bg-gold text-black font-bold px-6 py-3 rounded-full flex items-center gap-3 hover:scale-105 transition shadow-lg pointer-events-auto z-10"
              >
                <Download className="w-5 h-5" />
                Download GLB
              </button>
            )}
          </motion.div>

          {/* Right Data Boxes - unchanged */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 space-y-2 hidden lg:block pointer-events-none">
            <motion.div className="forge-data-box bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-56 shadow-xl pointer-events-auto">
              <h3 className="text-lg font-bold text-white mb-1">Forge Credits</h3>
              <p className="text-3xl font-black text-[#7DF9FF]">3</p>
              <p className="text-xs text-gray-400 mt-1">Free remaining today</p>
            </motion.div>
            <motion.div className="forge-data-box bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-56 shadow-xl pointer-events-auto">
              <h3 className="text-lg font-bold text-white mb-1">Prompts Forged</h3>
              <p className="text-3xl font-black text-gold">0</p>
              <p className="text-xs text-gray-400 mt-1">Session total</p>
            </motion.div>
            <motion.div className="forge-data-box bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-56 shadow-xl pointer-events-auto">
              <h3 className="text-lg font-bold text-white mb-1">Models Created</h3>
              <p className="text-3xl font-black text-emerald-400">0</p>
              <p className="text-xs text-gray-400 mt-1">Upgrade for unlimited</p>
            </motion.div>
          </div>
        </div>

        {/* Prompt Bar */}
        <ForgePromptBar
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onVoice={handleVoice}
          isLoading={isLoading}
          creditsRemaining={3}
        />
      </div>
    </section>
  );
}