// components/ui/CardNav.tsx — FINAL 2026 MJÖLNIR — LOGO HOVER PERFECTION
"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Sun, Moon, User, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import mjolnirLogo from "@/public/Assets/mjolnir_logo_transparent.png";

const items = [
  { label: "About", bgColor: "bg-gray-950", 
    links: 
      [{ label: "Studio", href: "/about/studio" }, 
        { label: "Mission", href: "/about/mission" }, 
        { label: "Roadmap", href: "/about/roadmap" }, 
        { label: "Team", href: "/about/team" },
      ] 
  },
  { label: "Demos", bgColor: "bg-gray-950", 
    links: 
      [{ label: "Atomic", href: "/demos/atomic" }, 
        { label: "Black Hole", href: "/demos/blackhole" }, 
        { label: "Color Halo", href: "/demos/colorhalo" },
        { label: "Gravity Lens", href: "/demos/gravitylens" },
      ] 
  },
  { label: "Intro", bgColor: "bg-gray-950", 
    links: 
      [{ label: "Get Started", href: "/intro/start" }, 
        { label: "Installation", href: "/intro/install" },
        { label: "Automation", href: "/intro/automation" },
        { label: "API Reference", href: "/intro/api" },
      ] 
  },
  { label: "Pricing", bgColor: "bg-gray-950", 
    links: 
      [{ label: "Base Plan", href: "/pricing/base" }, 
        { label: "Pro Plan", href: "/pricing/pro" }, 
        { label: "Elite Plan", href: "/pricing/elite" }, 
        { label: "Bitcoin Plan", href: "/pricing/bitcoin" },
      ] 
  },
];

export default function CardNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const closedHeight = 96;
  const openHeight = 620;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(navRef.current, { height: closedHeight, overflow: "hidden" });
      gsap.set(cardsRef.current, { y: -120, opacity: 0 });

      tlRef.current = gsap.timeline({ paused: true })
        .to(navRef.current, { height: openHeight, duration: 1, ease: "power3.out" })
        .to(cardsRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: { from: "start", amount: 0.3 },
          ease: "back.out(1.6)",
        }, "-=0.7");
    });

    return () => ctx.revert();
  }, []);

  const toggle = () => {
    if (!tlRef.current) return;
    isOpen ? tlRef.current.reverse() : tlRef.current.play();
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      {/* INVISIBLE SPACER — NO JUMP */}
      <div className="h-24 lg:h-[620px]" aria-hidden="true" />

      {/* FIXED CARDNAV — FLOATS ABOVE */}
      <div className="hidden lg:block fixed inset-x-0 top-0 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 pt-6 pointer-events-auto">
          <nav
            ref={navRef}
            className="relative bg-shadow border dark:border-white/[0.2] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl"
            style={{ height: closedHeight }}
          >
            {/* Top Bar */}
            <div className="absolute inset-x-0 top-0 h-24 flex items-center justify-between px-8 z-50 bg-shadow/80 backdrop-blur-xl rounded-t-3xl">
              {/* LOGO WITH YOUR PERFECT HOVER ANIMATION */}
              <Link href="/" className="flex-shrink-0 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="block"
                >
                  <Image
                    src={mjolnirLogo}
                    alt="Mjolnir Design Studios"
                    width={220}
                    height={70}
                    className="drop-shadow-2xl rounded-lg transition-all duration-300 group-hover:brightness-110"
                    priority
                  />
                </motion.div>
              </Link>

              {/* Right Buttons */}
              <div className="flex items-center gap-3">
                <button onClick={toggleTheme} className="w-12 h-12 border dark:border-white/[0.2] rounded-full hover:bg-white/5 transition flex items-center justify-center">
                  {isDark ? <Sun size={20} className="text-neutral-50" /> : <Moon size={20} className="text-neutral-800" />}
                </button>

                <Link href="/account" className="w-12 h-12 border dark:border-white/[0.2] rounded-full hover:bg-white/5 transition flex items-center justify-center">
                  <User size={20} className="text-neutral-50" />
                </Link>

                <button onClick={toggle} className="w-12 h-12 border dark:border-white/[0.2] rounded-full hover:bg-white/5 transition flex items-center justify-center">
                  {isOpen ? <X size={22} className="text-neutral-50" /> : <Menu size={22} className="text-neutral-50" />}
                </button>

                <a
                  href="/get-started"
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg transition-all hover:scale-105 whitespace-nowrap"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="absolute inset-x-8 top-28 grid grid-cols-4 gap-6">
              {items.map((item, i) => (
                <div
                  key={item.label}
                  ref={el => { cardsRef.current[i] = el; }}
                  className={cn(
                    "group rounded-3xl p-8 border dark:border-white/[0.1] backdrop-blur-xl transition-all duration-700 hover:border-white/30",
                    item.bgColor
                  )}
                >
                  <h3 className="text-3xl font-heading font-black text-neutral-50 mb-6 pb-4 border-b dark:border-white/10 group-hover:text-gold group-hover:border-gold/30 transition-all duration-500">
                    {item.label}
                  </h3>
                  <div className="space-y-5">
                    {item.links.map((link) => (
                      <a key={link.label} href={link.href} className="group/link flex items-center gap-3 text-neutral-300 text-lg font-medium transition-all duration-300 hover:text-gold">
                        <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover/link:text-gold group-hover/link:translate-x-2 group-hover/link:-translate-y-2 transition-all duration-300" />
                        <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-400 group-hover/link:after:w-full">
                          {link.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}