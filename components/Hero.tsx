// components/Hero.tsx — FINAL: ORIGINAL SIZE, SINGLE CTA TO PRICING
"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import EmeraldShimmer from "@/components/ui/Buttons/EmeraldShimmer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const thorRef = useRef<HTMLHeadingElement>(null);
  const subtitle1Ref = useRef<HTMLParagraphElement>(null);
  const subtitle2Ref = useRef<HTMLParagraphElement>(null);
  const sloganRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.from(line1Ref.current, { y: 200, opacity: 0, duration: 2, ease: "power4.out" }, 0)
        .from(line2Ref.current, { y: 200, opacity: 0, duration: 2, ease: "power4.out" }, 2)
        .from(thorRef.current, { scale: 0, opacity: 0, duration: 1.5, ease: "back.out(1.7)" }, 4)
        .to(thorRef.current, { textShadow: "0 0 60px #00f0ff, 0 0 120px #00f0ff", duration: 4 }, 6)
        .from(subtitle1Ref.current, { y: 100, opacity: 0, duration: 2 }, 8)
        .from(subtitle2Ref.current, { y: 100, opacity: 0, duration: 2 }, 10)
        .from(sloganRef.current, { y: 100, opacity: 0, duration: 2 }, 12)
        .from(".cta-button", { y: 80, opacity: 0, duration: 1.5 }, "-=1");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        <h2 ref={line1Ref} className="mt-18 text-3xl md:text-3xl lg:text-4xl font-black text-white tracking-wider uppercase pt-32 sm:pt-16 md:pt-0">
          Whosoever holds this hammer...
        </h2>

        <h2 ref={line2Ref} className="text-3xl md:text-4xl lg:text-4xl font-black text-white tracking-wider uppercase mt-4">
          if he be worthy, shall possess the power of
        </h2>

        <h1 ref={thorRef} className="text-5xl md:text-6xl lg:text-[7rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 drop-shadow-2xl mt-8" style={{ textShadow: "0 0 40px #00f0ff" }}>
          THOR!
        </h1>

        <p ref={subtitle1Ref} className="mt-8 sm:text-md text-lg md:text-4xl text-gray-300 font-light leading-relaxed max-w-5xl mx-auto">
          "Mjolnir, forged in the heart of a dying star...<br />
        </p>

        <p ref={subtitle2Ref} className="sm:text-md text-lg md:text-4xl text-gray-300 font-light leading-relaxed max-w-5xl mx-auto">
          a weapon to destroy...<br />
        </p>

        <p ref={sloganRef} className="mt-4 text-gold text-2xl md:text-3xl font-black">
          or a tool to build! <span className="text-gray-300">~ODIN</span>
        </p>

        {/* SINGLE CTA: WIELD MJÖLNIR! → PRICING (ORIGINAL SIZE) */}
        <div className="mt-10 cta-button">
          <Link href="/pricing">
            <EmeraldShimmer
              title="Wield Mjölnir!"
              position="right"
              otherClasses="text-2xl md:text-2xl px-12 py-6"
            />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-10 items-center" animate={{ y: [0, 15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-8 h-14 border-4 border-white/30 rounded-full flex justify-center">
          <div className="w-2 h-6 bg-white/80 rounded-full mt-3 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}