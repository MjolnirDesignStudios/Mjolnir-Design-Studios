// components/ui/Navigation/Navbar.tsx — FINAL: FORGE LINK SMART ROUTING
"use client";

import React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, User } from "lucide-react";

// Import from your data file
import { navItems } from "@/data";

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = React.useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious() ?? 0;
      const direction = current - previous;
      setVisible(current < 0.05 || direction < 0);
    }
  });

  // Detect mobile on client-side only
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="hidden lg:flex fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-black/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center">
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.25 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full opacity-0"
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.4 }}
              style={{
                boxShadow: "0 0 80px #00f0ff, 0 0 160px #00f0ff",
                background: "radial-gradient(circle, #00f0ff44, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <Image
              src="/Assets/mjolnir_logo_transparent.png"
              alt="MjolnirUI"
              width={160}
              height={160}
              className="rounded-full drop-shadow-2xl relative z-10"
              priority
            />
          </motion.div>
        </Link>

        {/* PERFECTLY CENTERED NAV LINKS */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12">
          {navItems.map((item) => {
            // Smart routing: Forge goes to full page on mobile, anchor on desktop
            const href = item.name === "Forge" && isMobile ? "/forge" : item.link;

            return (
              <Link
                key={item.name}
                href={href}
                className="text-lg font-medium text-gray-300 hover:text-gold transition relative group"
              >
                {item.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Search + Profile + Get Started */}
        <div className="ml-auto flex items-center gap-4">
          <button
            className="p-2.5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 group"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-neutral-300 group-hover:text-gold transition-colors" />
          </button>

          <button
            className="p-2.5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 group"
            title="Profile"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-neutral-300 group-hover:text-gold transition-colors" />
          </button>

          <Link
            href="/pricing"
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-full hover:scale-105 transition shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.div>
  );
}