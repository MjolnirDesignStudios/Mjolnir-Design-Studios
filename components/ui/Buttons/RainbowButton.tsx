// components/ui/RainbowButton.tsx — THE BIFROST HAS ARRIVED
"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RainbowButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  speed?: number; // seconds per cycle
}

export default function RainbowButton({
  children,
  href,
  className,
  speed = 8,
}: RainbowButtonProps) {
  const Component = href ? Link : "button";

  return (
    <Component
      href={href || "#"}
      className={cn(
        "group relative inline-flex h-12 cursor-pointer items-center justify-center rounded-full px-8 font-bold text-black transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/20",
        "overflow-hidden",
        "bg-[length:300%_300%] animate-rainbow",
        "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-red-500 before:via-yellow-500 before:to-purple-500 before:bg-[length:300%_300%] before:animate-rainbow before:opacity-80 before:blur-xl",
        "after:absolute after:inset-0 after:-z-20 after:bg-gradient-to-r after:from-red-400/50 after:via-purple-400/50 after:to-blue-400/50 after:bg-[length:300%_300%] after:animate-rainbow after:blur-3xl",
        className
      )}
      style={{
        animationDuration: `${speed}s`,
      } as React.CSSProperties}
    >
      {/* Inner glass layer */}
      <span className="relative z-10 backdrop-blur-sm bg-white/10 px-2 py-1 rounded-full border border-white/20">
        {children}
      </span>

      {/* Shine sweep */}
      <span className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 group-hover:translate-x-full" />
    </Component>
  );
}