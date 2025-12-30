// components/gsap/GSAPProvider.tsx
"use client";

import { gsap } from "gsap";
import { useEffect } from "react";

// Make gsap globally available in client components
export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Expose gsap to window so any component can use it
    if (typeof window !== "undefined") {
      (window as any).gsap = gsap;
    }
  }, []);

  return <>{children}</>;
}