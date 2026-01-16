// src/components/three/SceneClient.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import the actual 3D Scene to keep bundle size down and avoid SSR issues
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-black/80 rounded-3xl flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-gold" />
      <p className="text-gold text-lg">Initializing 3D Canvas...</p>
    </div>
  ),
});

interface SceneClientProps {
  modelUrl?: string | null; // Optional GLB URL from Meshy generation
}

export default function SceneClient({ modelUrl }: SceneClientProps = {}) {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full bg-black/80 rounded-3xl flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-gold" />
          <p className="text-gold text-lg">Loading Forge Canvas...</p>
        </div>
      }
    >
      <Scene modelUrl={modelUrl} />
    </Suspense>
  );
}