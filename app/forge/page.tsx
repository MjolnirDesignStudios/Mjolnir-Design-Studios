// app/forge/page.tsx — MOBILE FORGE: FULL-SCREEN, CHAT-STYLE
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2} from "lucide-react";
import { FloatingNav } from "@/components/ui/Navigation/FloatingNav";
import { Layers } from "lucide-react";
import { Hammer } from "lucide-react";


export default function MobileForge() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const MAX_FREE_QUERIES = 3;

  const handleSend = () => {
    if (!input.trim() || queryCount >= MAX_FREE_QUERIES) return;

    const userMsg = input;
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, `THE FORGE HAS SPOKEN:\n\n"${userMsg}"\n\nI have forged your request with thunder:\n• Golden Next.js landing page\n• 3D Mjolnir hero\n• XRPL wallet connect\n• Ready for 3D printing\n\nThunderous work, warrior.`]);
      setQueryCount(prev => prev + 1);
      setIsLoading(false);
    }, 2800);
  };

  return (
    <>
      <FloatingNav />

      <div className="fixed inset-0 bg-black flex flex-col">
        {/* HERO */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center z-10"
          >
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gold via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              THE MJÖLNIR FORGE
            </h1>
            <p className="text-xl text-gray-400 mt-4">Speak your will. I shall forge it.</p>
          </motion.div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 ${i % 2 === 0 ? "text-right" : "text-left"}`}
            >
              <div className={`inline-block max-w-xs lg:max-w-md px-6 py-4 rounded-3xl ${i % 2 === 0 ? "bg-emerald-600/20 border border-emerald-500/30" : "bg-black/60 border border-gold/30"}`}>
                <p className="text-white whitespace-pre-wrap">{msg}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" />
            </div>
          )}
        </div>

        {/* INPUT BAR — FIXED BOTTOM */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            {/* LEFT BUTTON — LAYERS ICON */}
            <button
              className="p-4 bg-emerald-600/20 border-2 border-emerald-500/60 rounded-full hover:bg-emerald-600/30 hover:border-emerald-400 transition-all duration-300 group"
              title="Layers"
              aria-label="Layers"
            >
              <Layers className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            </button>

            {/* INPUT */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder="Forge your command..."
              className="flex-1 px-8 py-5 bg-black/80 border border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition text-lg"
            />

            {/* RIGHT BUTTON — FORGE (HAMMER) */}
            <button
              onClick={handleSend}
              disabled={isLoading || queryCount >= MAX_FREE_QUERIES}
              className="p-4 bg-emerald-600/20 border-2 border-emerald-500/60 rounded-full hover:bg-emerald-600/30 hover:border-emerald-400 transition-all duration-300 group disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              ) : (
                <Hammer className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              )}
            </button>
          </div>

          <p className="text-center text-emerald-400 text-sm mt-3 font-medium">
            {MAX_FREE_QUERIES - queryCount} free forges remaining today
          </p>
        </div>
      </div>
    </>
  );
}