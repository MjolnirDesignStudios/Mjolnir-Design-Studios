// components/layout/UserNavbar.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings, User, LogOut, Zap } from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserNavbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUser(user);
      if (!user) router.push("/login");
    };

    checkUser();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
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
    timeoutRef.current = setTimeout(() => setIsSearchExpanded(false), 8000);
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    resetTimeout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex-shrink-0">
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

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {isSearchExpanded ? (
                <motion.div
                  initial={{ width: 56 }}
                  animate={{ width: 600 }}
                  exit={{ width: 56 }}
                  transition={{ duration: 0.4 }}
                  className="absolute right-0 origin-right"
                >
                  <div className="relative h-14">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search components, animations, blocks..."
                      onBlur={() => setTimeout(() => setIsSearchExpanded(false), 200)}
                      autoFocus
                      className="w-full h-full pl-14 pr-8 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:bg-white/15 text-lg"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleSearchClick}
                  className="h-14 w-14 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#7DF9FF] group"
                  aria-label="Search"
                  title="Search"
                >
                  <Search className="w-6 h-6 text-gray-300 group-hover:text-[#7DF9FF]" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <button
            className="h-14 w-14 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#34D399] group"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-gray-300 group-hover:text-[#34D399]" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-14 w-14 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#F0FF42] group"
              aria-label="Profile"
              title="Profile"
            >
              <User className="w-6 h-6 text-gray-300 group-hover:text-[#F0FF42]" />
            </button>

            <AnimatePresence>
              {isProfileOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
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
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span>Edit Profile</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 flex items-center gap-3">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span>Upgrade Plan</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-900/20 flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">Log Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="h-14 w-14 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#FF9900] group"
            aria-label="Log Out"
            title="Log Out"
          >
            <LogOut className="w-6 h-6 text-gray-300 group-hover:text-[#FF9900]" />
          </button>
        </div>
      </div>
    </header>
  );
}