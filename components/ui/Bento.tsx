// components/ui/Bento.tsx — FINAL: GAP WORKS ON MOBILE + LAPTOP PERFECT
"use client";

import React from "react";
import { GlowingEffect } from "@/components/ui/Animations/GlowingEffect";
import { cn } from "@/lib/utils";

interface BentoItemProps {
  children?: React.ReactNode;
  className?: string;
  area?: string;
}

interface BentoProps {
  children: React.ReactNode;
  className?: string;
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
}

export const BentoItem = ({ children, className, area }: BentoItemProps) => {
  return (
    // THIS LINE IS THE KEY — h-full makes the wrapper fill the grid cell
    <div className={cn("h-full w-full", area, className)}>
      <GlowingEffect blur={80} spread={140} disabled={false}>
        <div className="relative h-full rounded-3xl bg-black/60 backdrop-blur-xl border border-white/20 p-8 flex flex-col justify-center items-center gap-6 shadow-2xl">
          {children}
        </div>
      </GlowingEffect>
    </div>
  );
};

export const Bento = ({ children, className, mobile, tablet, desktop }: BentoProps) => {
  const isMobile = mobile ?? false;
  const isTablet = tablet ?? false;
  const isDesktop = desktop ?? false;

  return (
    <>
      {/* MOBILE — HUGE GAPS, ROCKET SETS HEIGHT */}
      {(isMobile || (!isMobile && !isTablet && !isDesktop)) && (
        <div className={cn("grid grid-cols-1 gap-20 px-6 w-full", className)}>
          {children}
        </div>
      )}

      {/* TABLET — Optional */}
      {isTablet && (
        <div className={cn("hidden md:grid lg:hidden grid-cols-2 gap-20 px-8 w-full", className)}>
          {children}
        </div>
      )}

      {/* DESKTOP — PERFECT CROSS */}
      {isDesktop && (
        <div className={cn("hidden lg:grid lg:grid-cols-12 gap-4 w-full", className)}>
          {children}
        </div>
      )}
    </>
  );
};