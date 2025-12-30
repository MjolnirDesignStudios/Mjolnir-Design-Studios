// components/mjolnirui/forge/ForgePrompt.tsx — VARIANT 2: ELONGATED EMERALD BUTTON
"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Hammer } from "lucide-react";
import { gsap } from "gsap";

interface ForgePromptProps {
  className?: string;
  onSubmit?: (input: string) => void;
  isLoading?: boolean;
  queryCount?: number;
  maxFreeQueries?: number;
}

export default function ForgePromptV2({
  className,
  onSubmit,
  isLoading = false,
  queryCount = 0,
  maxFreeQueries = 3,
}: ForgePromptProps) {
  const [input, setInput] = useState("");
  const buttonRef = useRef(null);

  const handleSubmit = () => {
    if (input) onSubmit?.(input);
    setInput("");
    gsap.to(buttonRef.current, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out" });
  };

  return (
    <div className={className}>
      <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSubmit()}
            placeholder="Forge your command, warrior..."
            className="flex-1 px-8 py-6 bg-black/90 border border-white/30 rounded-2xl text-white placeholder-gold/70 focus:outline-none focus:border-gold transition text-lg"
          />
          <button
            ref={buttonRef}
            onClick={handleSubmit}
            disabled={isLoading || queryCount >= maxFreeQueries}
            className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl font-bold text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-gold/40 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="flex items-center gap-3">
                <Hammer className="w-6 h-6" />
                FORGE
              </div>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-yellow-500 font-medium">
          {maxFreeQueries - queryCount} free Forge prompts remaining today
        </div>
      </div>
    </div>
  );
}