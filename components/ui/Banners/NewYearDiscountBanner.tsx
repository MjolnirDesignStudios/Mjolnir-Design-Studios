// components/ui/Banners/NewYearDiscountBanner.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NewYearDiscountBanner() {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gold via-yellow-500 to-amber-600 py-3 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-black font-bold text-lg">
          🎉 <span className="text-2xl">2026 New Year Special</span> — 40% OFF Annual Plans! Limited time only.
        </p>
        <Link href="/pricing">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="mt-2 px-6 py-2 bg-black text-gold font-bold rounded-full hover:bg-gray-900 transition"
          >
            Claim Discount Now
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}