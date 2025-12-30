// components/Forge.tsx — FINAL: PERFECT FORGE WITH ForgePromptV1
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ForgePromptV1 from "@/components/mjolnirui/forge/ForgePromptV1";

export default function Forge() {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);

  const MAX_FREE_QUERIES = 3;

  const handleForge = (input: string) => {
    if (queryCount >= MAX_FREE_QUERIES) {
      setResponse("You've used all 3 free forges today. Subscribe to MjölnirUI Pro for unlimited thunder.");
      return;
    }

    setIsLoading(true);
    setResponse("");

    setTimeout(() => {
      setResponse(`THE FORGE HAS SPOKEN:\n\n"${input}"\n\nI have forged your request with thunder:\n• Golden Next.js landing page\n• 3D Mjölnir hero animation\n• XRPL wallet integration\n• Ready for 3D printing via Meshy\n\nThunderous work, warrior.`);
      setQueryCount(prev => prev + 1);
      setIsLoading(false);
    }, 2800);
  };

  return (
    <section id="forge" className="py-4 mb-16 relative min-h-screen items-center">
      <div className="max-w-7xl mx-auto px-10">
        {/* HEADER — 100% IDENTICAL TO ABOUT.TSX */}
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">
            The Mjölnir <span className="text-gold">Forge</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto">
            Speak your will. I shall forge it — digital or physical.
          </p>
        </div>

        {/* FORGE PROMPT — PREMIUM V1 */}
        <div className="max-w-5xl mx-auto">
          <ForgePromptV1
            onSubmit={handleForge}
            isLoading={isLoading}
            queryCount={queryCount}
            maxFreeQueries={MAX_FREE_QUERIES}
          />
        </div>

        {/* RESPONSE — SAME AS YOUR OTHER SECTIONS */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 max-w-5xl mx-auto p-10 bg-black/80 rounded-3xl border border-gold/40 text-gold font-mono text-lg leading-relaxed"
          >
            {response}
          </motion.div>
        )}
      </div>
    </section>
  );
}