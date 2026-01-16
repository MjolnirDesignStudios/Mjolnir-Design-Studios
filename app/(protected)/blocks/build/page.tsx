// app/build/page.tsx — MjolnirUI Components Introduction (Post-Login Landing)
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/ui/Navigation/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings, User, LogOut, Zap, Download, FileCode, Layout, Terminal } from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BuildDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const rightButtonsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUser(user);
      setLoading(false);
      if (!user) router.push("/login");
    };

    checkUser();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === "SIGNED_OUT" || !session?.user) router.push("/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsSearchExpanded(false);
    }, 8000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    resetTimeout();
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    resetTimeout();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      {/* NAVBAR — 4 Buttons: Search (blue), Settings (green), Profile (gold), Logout (orange) */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center">
          {/* LEFT: Logo */}
          <Link href="/" className="flex-shrink-0 mr-auto">
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

          {/* RIGHT: 4 Buttons */}
          <div ref={rightButtonsRef} className="flex items-center gap-4">
            {/* Search (Blue hover) */}
            <div className="relative h-14 flex items-center">
              <AnimatePresence mode="wait">
                {isSearchExpanded ? (
                  <motion.div
                    initial={{ width: 56 }}
                    animate={{ width: 600 }}
                    exit={{ width: 56, transition: { duration: 0.5, ease: "easeInOut" } }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute right-0 origin-right"
                  >
                    <div className="relative h-14">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search components, animations, blocks..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onBlur={() => setTimeout(() => setIsSearchExpanded(false), 200)}
                        autoFocus
                        className="w-full h-full pl-14 pr-8 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 transition-all duration-300 text-lg"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={handleSearchClick}
                    className="h-14 w-14 p-3 rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#7DF9FF] transition-all duration-300 group flex items-center justify-center"
                    title="Search"
                    aria-label="Search"
                  >
                    <Search className="w-6 h-6 text-gray-300 group-hover:text-[#7DF9FF] transition-colors" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Settings (Green hover) */}
            <button
              className="h-14 w-14 p-3 rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#34D399] transition-all duration-300 group flex items-center justify-center"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6 text-gray-300 group-hover:text-[#34D399] transition-colors" />
            </button>

            {/* Profile Dropdown (Gold hover) */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-14 w-14 p-3 rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#F0FF42] transition-all duration-300 group flex items-center justify-center"
                title="Profile"
                aria-label="Profile"
              >
                <User className="w-6 h-6 text-gray-300 group-hover:text-[#F0FF42] transition-colors" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold to-amber-600 rounded-full flex items-center justify-center text-2xl font-black">
                          {user.email?.[0].toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.email || "Asgardian"}</p>
                          <p className="text-sm text-gray-400">Free Plan</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>Edit Profile</span>
                      </button>
                      <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3">
                        <Zap className="w-5 h-5 text-gray-400" />
                        <span>Upgrade Plan</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-900/20 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-5 h-5 text-red-400" />
                        <span className="text-red-400">Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout (Bitcoin orange hover) */}
            <button
              onClick={handleLogout}
              className="h-14 w-14 p-3 rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#FF9900] transition-all duration-300 group flex items-center justify-center"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-6 h-6 text-gray-300 group-hover:text-[#FF9900] transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT — Zero gap above title */}
      <div className="flex flex-1 pt-32">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-950 via-purple-950/5 to-neutral-950">
          <div className="px-10 lg:px-20 pt-10 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              {/* Title — Minimal spacing */}
              <div className="text-center">
                <h1 className="text-6xl md:text-7xl font-black text-white">
                  MjolnirUI Components
                </h1>
                <p className="text-2xl md:text-3xl text-gold mt-4 max-w-4xl mx-auto leading-relaxed">
                  Welcome back, Asgardian!<br />
                  Build fast with powerful, animated component designs.
                </p>
              </div>

              <div className="mt-16 space-y-20">
                {/* Introduction */}
                <section>
                  <h2 className="text-4xl font-bold text-white mb-6">Introduction</h2>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                    MjolnirUI is a premium collection of animated, responsive, copy-paste ready components for Next.js and TailwindCSS.
                    Designed for rapid deployment and maximum impact.
                  </p>
                </section>

                {/* Quick Start Grid */}
                <section>
                  <h2 className="text-4xl font-bold text-white mb-10">Quick Start</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <Link href="/build/installation" className="group">
                      <div className="p-8 bg-black/50 border border-white/10 rounded-3xl hover:border-emerald-500/60 transition-all duration-500">
                        <Download className="w-12 h-12 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-3">Installation</h3>
                        <p className="text-gray-400">Get started in seconds</p>
                      </div>
                    </Link>

                    <Link href="/build/installation/nextjs" className="group">
                      <div className="p-8 bg-black/50 border border-white/10 rounded-3xl hover:border-emerald-500/60 transition-all duration-500">
                        <FileCode className="w-12 h-12 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-3">Next.js Setup</h3>
                        <p className="text-gray-400">App Router ready</p>
                      </div>
                    </Link>

                    <Link href="/build/installation/tailwind" className="group">
                      <div className="p-8 bg-black/50 border border-white/10 rounded-3xl hover:border-emerald-500/60 transition-all duration-500">
                        <Layout className="w-12 h-12 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-3">TailwindCSS</h3>
                        <p className="text-gray-400">Zero config needed</p>
                      </div>
                    </Link>

                    <Link href="/build/installation/cli" className="group">
                      <div className="p-8 bg-black/50 border border-white/10 rounded-3xl hover:border-emerald-500/60 transition-all duration-500">
                        <Terminal className="w-12 h-12 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-3">CLI Tools</h3>
                        <p className="text-gray-400">Add components instantly</p>
                      </div>
                    </Link>
                  </div>
                </section>

                {/* Call to Action */}
                <section className="text-center py-16">
                  <Link href="/blocks">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-16 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-2xl font-bold rounded-full hover:shadow-2xl hover:shadow-emerald-500/50 transition shadow-lg"
                    >
                      Explore All Components
                    </motion.button>
                  </Link>
                </section>
              </div>
            </motion.div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}