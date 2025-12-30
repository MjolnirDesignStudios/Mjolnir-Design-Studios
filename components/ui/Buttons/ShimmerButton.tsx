// components/ui/Buttons/ShimmerButton.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface Props {
  title: string;
  icon?: React.ReactNode;
  position?: string;
  handleClick?: () => void;
  otherClasses?: string;
}

export default function ShimmerButton({
  title,
  icon,
  position = "left",
  handleClick,
  otherClasses,
}: Props) {
  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex h-14 w-84 items-center justify-center rounded-xl border border-slate-800",
        "bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] animate-shimmer",
        "px-6 font-bold text-xl text-white transition-all hover:scale-105 shadow-2xl hover:shadow-gold-300/50 focus:outline-none focus:ring-4 focus:ring-white/20",
        "whitespace-nowrap overflow-hidden",
        // Mobile: full width, Desktop: fixed width
        "w-92 sm:w-92",
        otherClasses
      )}
    >
      <span className="flex items-center gap-3 truncate">
        {position === "left" && (icon || <Zap className="w-6 h-6 flex-shrink-0" />)}
        <span className="truncate">{title}</span>
        {position === "right" && (icon || <Zap className="w-6 h-6 flex-shrink-0" />)}
      </span>
    </button>
  );
}