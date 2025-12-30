// components/mjolnirui/forge/AgenticAI.tsx
"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";

const SYSTEM_PROMPT = `
You are MjolnirUI Agent — a thunderous AI builder optimized for business development, digital design, engineering, and web projects. Your core mission is to help users forge powerful digital experiences using MjolnirUI components.

Key Guidelines:
- Be concise, professional, and creative. Use epic language inspired by Norse mythology (e.g., "Forge this component like Thor's hammer").
- Always provide actionable output: code snippets, design suggestions, business strategies, or engineering plans.
- Use tools when needed: code_execution for testing/generating code, web_search for research, x_keyword_search for social insights.
- For web projects: Recommend Next.js, Tailwind, Framer Motion, Three.js.
- For design: Suggest golden ratios, color palettes (gold/orange themes), animations.
- For business: Provide growth hacks, MVP plans, monetization strategies.
- Freemium limits: Remind users of 5 free queries/day; suggest upgrading for more.
- If query is unclear, ask for clarification.

Output Format:
1. **Summary**: Brief response to query.
2. **Action Plan**: Step-by-step guide.
3. **Code/Design**: If applicable, provide code or Figma-like pseudocode.
4. **Next Steps**: What user should do next.
`;

interface AgenticAIProps {
  className?: string;
}

export default function AgenticAI({ className }: AgenticAIProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResponse("");
    
    // Freemium check (localStorage)
    const today = new Date().toDateString();
    const queries = JSON.parse(localStorage.getItem("mjolnir_queries") || "{}");
    if (queries[today] >= 5) {
      setResponse("You've reached your 5 free queries for today. Upgrade to Pro for unlimited thunder!");
      setIsLoading(false);
      return;
    }
    queries[today] = (queries[today] || 0) + 1;
    localStorage.setItem("mjolnir_queries", JSON.stringify(queries));

    // Stub LLM call (replace with real Grok/Replit/Hugging Face API)
    // Example: const res = await fetch('/api/grok', { method: 'POST', body: JSON.stringify({ prompt: SYSTEM_PROMPT + input }) });
    const res = await new Promise<{ text: string }>((resolve) =>
      setTimeout(() => resolve({ text: "Mjolnir AI response: Forging your request..." }), 1500)
    );

    // GSAP typing animation
    gsap.to(responseRef.current, {
      text: res.text,
      duration: res.text.length * 0.05,
      ease: "power1.inOut",
      onComplete: () => setIsLoading(false),
    });
  };

  return (
    <div className={cn("relative p-6 bg-black/40 rounded-3xl border border-white/10 shadow-2xl", className)}>
      {/* 3D Mjolnir Canvas */}
      <Canvas className="absolute inset-0 pointer-events-none">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <MjolnirModel />
      </Canvas>

      {/* Input Box */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Forge your command, warrior..."
          className="w-full p-4 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gold/60 focus:outline-none focus:border-gold"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          className="absolute right-4 top-1/2 -translate-y-1/2"
          title="Send"
          aria-label="Send"
        >
          <Send className="w-5 h-5 text-gold hover:scale-110 transition" />
        </button>
      </div>

      {/* Response */}
      <div ref={responseRef} className="mt-6 p-4 rounded-xl bg-black/80 border border-white/10 text-white min-h-[200px]">
        {isLoading && <Loader className="animate-spin text-gold" />}
      </div>
    </div>
  );
}

// 3D MJÖLNIR COMPONENT (Meshy model)
function MjolnirModel() {
  const mjolnir = useGLTF("/models/mjolnir.glb");
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={ref} object={mjolnir.scene} scale={1.5} position={[0, 0, -5]} />;
}