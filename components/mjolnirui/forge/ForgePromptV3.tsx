// components/mjolnirui/forge/ForgePrompt.tsx — VARIANT 3: MINIMAL EMERALD BUTTON WITH HAMMER
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

export default function ForgePromptV3({
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
    gsap.to(buttonRef.current, { rotation: 360, duration: 0.6, ease: "power2.inOut" });
  };

  return (
    <div className={className}>
      <div className="bg-black/70 backdrop-blur-lg rounded-3xl border border-white/15 p-6 shadow-xl">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSubmit()}
            placeholder="Forge your command, warrior..."
            className="flex-1 px-6 py-4 bg-black/80 border border-white/25 rounded-2xl text-white placeholder-gold/60 focus:outline-none focus:border-gold transition text-lg"
          />
          <button
            ref={buttonRef}
            onClick={handleSubmit}
            disabled={isLoading || queryCount >= maxFreeQueries}
            className="p-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-gold/50 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Hammer className="w-6 h-6 text-white" />}
          </button>
        </div>

        <div className="mt-6 text-center text-yellow-500 font-medium">
          {maxFreeQueries - queryCount} free Forge prompts remaining today
        </div>
      </div>
    </div>
  );
}