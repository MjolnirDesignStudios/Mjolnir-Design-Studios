// components/ui/Animations/BifrostGradient.tsx
"use client";

import { useEffect, useRef, useState } from "react";

// Utility function for conditional class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface BifrostGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  interactive?: boolean;
  speed?: number;
  intensity?: number;
  size?: string;
}

export const BifrostGradient = ({
  children,
  className,
  containerClassName,
  interactive = true,
  speed = 1.0,
  intensity = 1.0,
  size = "80%",
}: BifrostGradientProps) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    const colors = [
      "255, 0, 0",       // Red
      "255, 102, 0",     // Orange
      "255, 204, 17",    // Gold
      "0, 255, 100",     // Spring Green
      "0, 204, 255",     // Electric Cyan
      "100, 100, 255",   // Indigo
      "180, 0, 255",     // Violet
    ];

    colors.forEach((color, i) => {
      document.body.style.setProperty(`--rainbow-${i + 1}`, color);
    });

    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--intensity", intensity.toString());
    document.body.style.setProperty("--speed", speed.toString());
  }, [size, intensity, speed]);

  useEffect(() => {
    const move = () => {
      if (!interactiveRef.current) return;
      setCurX((prev) => prev + (tgX - prev) / 20);
      setCurY((prev) => prev + (tgY - prev) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    };
    const id = setInterval(move, 16);
    return () => clearInterval(id);
  }, [tgX, tgY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(e.clientX - rect.left);
      setTgY(e.clientY - rect.top);
    }
  };

  const isSafari = typeof navigator !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-black", containerClassName)}>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-slate-900 to-black" />

      <svg className="hidden">
        <defs>
          <filter id="bifrostBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -12"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className={cn("gradients-container h-full w-full", isSafari ? "blur-3xl" : "blur-[80px]")}>
        {[
          { anim: "animate-rainbow-1", color: "var(--rainbow-1)" },
          { anim: "animate-rainbow-2", color: "var(--rainbow-2)" },
          { anim: "animate-rainbow-3", color: "var(--rainbow-3)" },
          { anim: "animate-rainbow-4", color: "var(--rainbow-4)" },
          { anim: "animate-rainbow-5", color: "var(--rainbow-5)" },
          { anim: "animate-rainbow-6", color: "var(--rainbow-6)" },
          { anim: "animate-rainbow-7", color: "var(--rainbow-7)" },
        ].map((orb, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-[var(--size)] h-[var(--size)]",
              "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
              "opacity-80 mix-blend-screen",
              orb.anim
            )}
            style={{
              background: `radial-gradient(circle at center, rgba(${orb.color}, 0.9) 0%, rgba(${orb.color}, 0) 70%)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${20 / speed}s`,
            }}
          />
        ))}

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className="absolute w-full h-full -top-1/2 -left-1/2 opacity-70 mix-blend-screen"
            style={{
              background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>

      <div className={cn("relative z-10 h-full w-full", className)}>
        {children}
      </div>
    </div>
  );
};