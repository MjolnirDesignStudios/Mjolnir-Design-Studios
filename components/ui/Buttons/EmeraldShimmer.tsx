// components/ui/Buttons/EmeraldShimmer.tsx — EXACT SAME SIZE
import React from "react";
import { cn } from "@/lib/utils";
import { Hammer } from "lucide-react";

interface Props {
  title: string;
  icon?: React.ReactNode;
  position?: string;
  handleClick?: () => void;
  otherClasses?: string;
}

export default function EmeraldShimmer({
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
        "inline-flex h-14 w-84 items-center justify-center rounded-xl border border-emerald-500/50",
        "bg-[linear-gradient(110deg,#000103,45%,#065f46,55%,#000103)] bg-[length:200%_100%] animate-shimmer",
        "px-6 font-bold text-xl text-white transition-all hover:scale-105",
        "shadow-2xl hover:shadow-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/30",
        "whitespace-nowrap overflow-hidden",
        "w-84 sm:w-84", // ← SAME AS SHIMMER BUTTON
        otherClasses
      )}
    >
      <span className="flex items-center gap-3 truncate">
        {position === "left" && (icon || <Hammer className="w-6 h-6 flex-shrink-0" />)}
        <span className="truncate">{title}</span>
        {position === "right" && (icon || <Hammer className="w-6 h-6 flex-shrink-0" />)}
      </span>
    </button>
  );
}