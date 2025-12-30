// components/ui/Animations/GlowingEffect.tsx — FINAL: RAINBOW GLOW WORKS
"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface GlowingEffectProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  spread?: number;
  disabled?: boolean;
}

export const GlowingEffect = ({
  children,
  className,
  blur = 80,
  spread = 140,
  disabled = false,
}: GlowingEffectProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || disabled) return;

    const el = ref.current;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.hypot(x - centerX, y - centerY);
      const maxDistance = Math.hypot(centerX, centerY) * 0.7;

      if (distance < maxDistance) {
        el.style.setProperty("--active", "0");
        return;
      }

      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
      el.style.setProperty("--active", "1");
      el.style.setProperty("--angle", `${angle}deg`);
    };

    const handleLeave = () => {
      el.style.setProperty("--active", "0");
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [disabled]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-3xl", className)}
      style={{
        "--blur": `${blur}px`,
        "--spread": `${spread}deg`,
        "--angle": "0deg",
        "--active": "0",
      } as React.CSSProperties}
    >
      {/* RAINBOW GLOW — FIXED MASK */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: "var(--active)",
          background: "conic-gradient(from var(--angle) at 50% 50%, #ff006e, #ff8c00, #06b6d4, #8b5cf6, #ff006e)",
          filter: "blur(var(--blur))",
          maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 70%)",
        }}
      />

      {/* RAINBOW BORDER */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: "var(--active)",
          border: "3px solid transparent",
          borderImage: "conic-gradient(from var(--angle), #ff006e, #ff8c00, #06b6d4, #8b5cf6, #ff006e) 1",
          borderImageSlice: 1,
        }}
      />

      {children}
    </div>
  );
};