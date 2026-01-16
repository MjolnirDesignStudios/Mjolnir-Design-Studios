// components/mjolnirui/forge/ForgePromptBar.tsx — Floating Forge Prompt Bar (Compact, Centered)
"use client";

import React from "react";
import { FileText, Mic, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";

interface ForgePromptBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onVoice?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  creditsRemaining?: number;
  className?: string;
}

export default function ForgePromptBar({
  value: controlledValue,
  onChange,
  onSend,
  onVoice,
  isLoading = false,
  placeholder = "Describe your creation...",
  creditsRemaining,
  className,
}: ForgePromptBarProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const inputValue = controlledValue !== undefined ? controlledValue : internalValue;
  const setInputValue = onChange || setInternalValue;

  const handleSend = () => {
    if (isLoading || !inputValue.trim()) return;
    onSend?.();
    if (controlledValue === undefined) {
      setInternalValue("");
    }
  };

  const handleVoice = () => {
    onVoice?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading && inputValue.trim()) {
      handleSend();
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto px-6", className)}>
      <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 flex items-center gap-5 shadow-2xl shadow-black/50 hover:shadow-cyan-500/20 transition-shadow duration-500">
        <button
          type="button"
          aria-label="Upload file"
          title="Upload file"
          className="p-4 rounded-full bg-emerald-600/20 border-2 border-emerald-500/60 hover:bg-emerald-600/30 transition-all group"
        >
          <FileText className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
        </button>

        <button
          type="button"
          onClick={handleVoice}
          aria-label="Voice input"
          title="Voice input"
          className="p-4 rounded-full bg-emerald-600/20 border-2 border-emerald-500/60 hover:bg-emerald-600/30 transition-all group"
        >
          <Mic className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 px-8 py-5 bg-black/60 border border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition text-lg disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
          title="Send message"
          className={cn(
            "p-4 rounded-full transition-all",
            isLoading || !inputValue.trim()
              ? "bg-gray-600/20 border-2 border-gray-500/60 cursor-not-allowed"
              : "bg-emerald-600/20 border-2 border-emerald-500/60 hover:bg-emerald-600/30 group"
          )}
        >
          <Hammer
            className={cn(
              "w-6 h-6",
              isLoading || !inputValue.trim()
                ? "text-gray-500"
                : "text-emerald-400 group-hover:text-emerald-300"
            )}
          />
        </button>
      </div>

      {creditsRemaining !== undefined && (
        <p className="text-center text-gray-400 text-sm mt-4">
          {creditsRemaining} free forge credits remaining today!
        </p>
      )}
    </div>
  );
}