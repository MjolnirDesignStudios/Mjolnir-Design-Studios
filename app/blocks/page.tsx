// app/blocks/page.tsx — Supabase Auth + Your Design Preserved
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Navigation/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Heart, Zap } from "lucide-react";
import EmeraldShimmer from "@/components/ui/Buttons/EmeraldShimmer";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function BlocksDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check auth state with Supabase
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        router.push("/login"); // Redirect if not signed in
      }
    };

    checkUser();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === "SIGNED_OUT" || !session?.user) {
        router.push("/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white text-2xl">
        Loading Forge...
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting to login
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      {/* TOP BAR — React Bits Style */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* LEFT: Logo */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.15 }}
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
              alt="MjolnirUI Logo"
              width={100}
              height={100}
              className="rounded-full drop-shadow-2xl relative z-10"
              priority
            />
          </motion.div>

          {/* CENTER: Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search components, animations, blocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white/15 transition-all duration-300"
              />
            </div>
          </div>

          {/* RIGHT: Favorites + GitHub */}
          <div className="flex items-center gap-6">
            <button
              className="p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-emerald-500 transition-all duration-300 group"
              aria-label="Add to favorites"
            >
              <Heart className="w-6 h-6 text-gray-300 group-hover:text-emerald-400 transition-colors" />
            </button>

            <a
              href="https://github.com/mjolnirdesigns/mjolnirui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star on GitHub"
              title="Star on GitHub"
            >
              <EmeraldShimmer
                title="Star on GitHub"
                position="right"
                otherClasses="px-8 py-3 text-lg font-bold"
                icon={<Zap className="w-5 h-5 ml-2" />}
              />
            </a>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 pt-24">
        <Sidebar />

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-950 via-purple-950/5 to-neutral-950">
          <div className="p-10 lg:p-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-20">
                <h1 className="text-6xl md:text-8xl font-black text-white mb-6">
                  MjolnirUI Blocks
                </h1>
                <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Welcome back, {user.email || "Asgardian"}!<br />
                  Every component is battle-ready and forged for maximum impact.
                </p>
              </div>

              {/* Component Grid — Ready for free/premium gating */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(18)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-xl hover:border-emerald-500/60 transition-all duration-500 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative h-full p-10 flex flex-col justify-between">
                      <div>
                        <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-2xl border-2 border-emerald-500/50 flex items-center justify-center">
                          <Zap className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-center text-white mb-3">
                          Component {i + 1}
                        </h3>
                        <p className="text-gray-400 text-center text-sm">
                          Animated • Responsive • Copy-Paste
                        </p>
                      </div>

                      <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <EmeraldShimmer
                          title="View Code"
                          position="center"
                          otherClasses="px-8 py-3 text-lg"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}