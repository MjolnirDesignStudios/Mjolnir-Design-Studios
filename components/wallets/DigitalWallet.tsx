// components/ui/DigitalWallet.tsx — FINAL: PREMIUM WEB3 WALLET ANIMATION
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, DollarSign } from "lucide-react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

// Animated Beam — flows left to right
const Beam = ({ tone = "gold", children }: { tone?: string; children: React.ReactNode }) => {
  return (
    <div className="relative flex items-center justify-center h-24 w-full overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60 blur-xl"
        animate={{ x: [-100, 100] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
      />
      {children}
    </div>
  );
};

// Subtle glow around icons
const Glow = ({ variant = "center", className }: { variant?: string; className?: string }) => {
  return (
    <div className={cn("absolute inset-0 bg-radial-gradient from-yellow-400/20 to-transparent blur-3xl", className)} />
  );
};

interface DigitalWalletProps {
  className?: string;
  sourceToken?: string;
  destToken?: string;
  amount?: number;
  onSend?: () => void;
}

export default function DigitalWallet({
  className,
  sourceToken = "BTC",
  destToken = "USD",
  amount = 0,
  onSend,
}: DigitalWalletProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSend = () => {
    setIsAnimating(true);
    onSend?.();
    console.log(`Sending ${amount} ${sourceToken} → ${destToken}`);

    gsap.to(".particle", {
      x: "100%",
      duration: 1.8,
      stagger: 0.08,
      ease: "power2.out",
      onComplete: () => setIsAnimating(false),
    });
  };

  return (
    <div className={cn("relative flex w-full flex-col gap-6 p-6 text-sm", className)}>
      {/* Pipeline Row */}
      <div className="flex items-center justify-around">
        {/* Source Token */}
        <div className="relative z-10">
          <div className="border border-white/20 rounded-full p-3 bg-black/40 backdrop-blur-xl shadow-2xl">
            <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 shadow-inner">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Beam + Center Icon */}
        <div className="relative">
          <Beam>
            <div className="p-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-400 shadow-2xl">
              <DollarSign className="w-12 h-12 text-white" />
            </div>
          </Beam>
        </div>

        {/* Destination Token */}
        <div className="relative z-10">
          <div className="border border-white/20 rounded-full p-3 bg-black/40 backdrop-blur-xl shadow-2xl">
            <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-inner">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <Glow />

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={isAnimating}
        className="mx-auto px-12 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl disabled:opacity-70"
      >
        {isAnimating ? "Sending..." : "Send Payment"}
      </button>
    </div>
  );
}