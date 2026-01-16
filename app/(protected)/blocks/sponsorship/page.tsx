// app/sponsorship/page.tsx
"use client";

import React from "react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Star } from "lucide-react";

const tiers = [
  {
    name: "Bronze",
    price: "$99/mo",
    color: "#7DF9FF",
    features: [
      "Logo on sidebar",
      "Mention in newsletter",
      "Thanks on Discord",
    ],
  },
  {
    name: "Silver",
    price: "$499/mo",
    color: "#34D399",
    features: [
      "Larger logo on homepage",
      "Featured in newsletter",
      "Pinned shoutout on X",
      "Priority support",
    ],
  },
  {
    name: "Gold",
    price: "$999/mo",
    color: "#F0FF42",
    features: [
      "Top placement on homepage",
      "Dedicated newsletter section",
      "Co-host AMA",
      "Custom feature request",
    ],
  },
  {
    name: "Bitcoin",
    price: "Custom",
    color: "#FF9900",
    features: [
      "Everything in Gold",
      "Direct collaboration",
      "Custom component development",
      "Paid in Bitcoin",
    ],
  },
];

export default function SponsorshipPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      {/* Reuse your navbar */}
      {/* ... (copy navbar from blocks/page.tsx) ... */}

      <div className="flex-1 pt-32">
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-950 via-purple-950/5 to-neutral-950">
          <div className="p-10 lg:p-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-20">
                <h1 className="text-6xl md:text-8xl font-black text-white mb-6">
                  Sponsor MjolnirUI
                </h1>
                <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
                  Help us grow and keep MjolnirUI free for developers worldwide.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {tiers.map((tier) => (
                  <motion.div
                    key={tier.name}
                    whileHover={{ scale: 1.05 }}
                    className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-xl p-8"
                    style={{ borderColor: tier.color + "60" }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-4">{tier.name}</h2>
                    <p className="text-4xl font-black mb-8" style={{ color: tier.color }}>
                      {tier.price}
                    </p>
                    <ul className="space-y-4 mb-10">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-gray-300">
                          <Zap className="w-5 h-5" style={{ color: tier.color }} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="w-full py-4 rounded-xl font-bold text-black transition"
                      style={{ backgroundColor: tier.color }}
                    >
                      Become {tier.name} Sponsor
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-20">
                <p className="text-gray-400 mb-4">
                  Have questions? Contact us at{" "}
                  <a href="mailto:contact@mjolnirdesignstudios.com" className="text-gold underline">
                    contact@mjolnirdesignstudios.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}