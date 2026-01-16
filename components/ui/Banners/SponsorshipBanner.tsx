// components/ui/Banners/SponsorshipBanner.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function SponsorshipBanner() {
  return (
    <Link href="/sponsorship">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.03 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/50 via-gold-700/30 to-black/80 border border-white/10 p-12 cursor-pointer group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-yellow-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white mb-3">
            Become A Sponsor!
          </h3>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Help us maintain and grow MjolnirUI — keeping it powerful and free for devs worldwide.
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-gray-200">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Your logo on our site</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Featured in newsletter</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Shoutout on GitHub and X</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Priority feature requests</span>
            </li>
          </ul>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Become a Sponsor
            <Zap className="w-5 h-5" />
          </motion.button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Trusted by users worldwide
          </p>
        </div>
      </motion.div>
    </Link>
  );
}