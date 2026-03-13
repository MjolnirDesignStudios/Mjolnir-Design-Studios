// components/ui/FloatingNav.tsx — FINAL 2026 MJÖLNIR MOBILE NAV (SOLID BG)
"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, User, Github } from "lucide-react";

const navItems = [
  { name: "About", link: "/#about" },
  { name: "Build", link: "/#build" },
  { name: "Forge", link: "/#forge" },
  { name: "Pricing", link: "/#pricing" },
  { name: "Tech", link: "/#tech" },
];

export const FloatingNav = ({ className }: { className?: string }) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSwipeTimeRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() || 0;
    const direction = current - previous;

    if (current < 10) {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 3000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(direction < 0);
    }
  });

  const handleInteraction = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
  };

  React.useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const duration = Date.now() - touchStartTime;
      if (duration < 300 && deltaY > 50) {
        const now = Date.now();
        if (now - lastSwipeTimeRef.current < 500) {
          setVisible(false);
          if (timerRef.current) clearTimeout(timerRef.current);
        }
        lastSwipeTimeRef.current = now;
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={cn(
            "fixed top-4 inset-x-4 z-[5000] flex items-center justify-between",
            // SOLID, OPAQUE, BEAUTIFUL BACKGROUND
            "bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl",
            "px-6 py-5 shadow-2xl shadow-black/50",
            "supports-[backdrop-filter]:bg-black/80",
            "lg:hidden",
            className
          )}
          onTouchStart={handleInteraction}
          onMouseEnter={handleInteraction}
        >
          {/* LEFT: Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/Assets/mjolnir_logo_transparent.png"
              alt="Mjolnir Design Studios"
              width={180}
              height={36}
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 140px, 180px"
              priority
            />
          </Link>

          {/* RIGHT: Icons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => alert("Search coming soon")}
              className="p-2.5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-neutral-300 hover:text-gold transition-colors" />
            </button>

            {/* NEW: Login Button */}
            <button
              onClick={() => alert("NextAuth Login coming soon")}
              className="p-2.5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              aria-label="Login"
            >
              <User className="w-5 h-5 text-neutral-300 group-hover:text-gold transition-colors" />
            </button>

            {/* Hamburger / X — NOW IN SAME STYLE */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-neutral-300 group-hover:text-gold transition-colors" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-300 group-hover:text-gold transition-colors" />
              )}
            </button>
          </div>

          {/* DROPDOWN MENU — ALSO SOLID */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-b-2xl shadow-2xl shadow-black/60 overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  {/* GitHub Badge */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-electric/10 to-gold/10 rounded-xl p-4 border border-electric/20">
                    <div className="flex items-center gap-3">
                      <Github className="w-6 h-6 text-electric" />
                      <span className="text-lg font-heading text-electric">GitHub Stars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-gold">12.4k</span>
                      <span className="text-sm text-gray-400">★</span>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-5">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="block group"
                      >
                        <span className="text-2xl font-heading text-neutral-50 group-hover:text-gold transition-colors duration-300 relative">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-500 group-hover:w-full" />
                        </span>
                      </Link>
                    ))}
                  </nav>

                  <div className="pt-4 border-t border-white/10">
                    <Link
                      href="https://discord.gg/mjolnirdesignstudios"
                      className="text-lg text-gray-400 hover:text-gold transition-colors"
                    >
                      Join Our Social Media Channels
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};