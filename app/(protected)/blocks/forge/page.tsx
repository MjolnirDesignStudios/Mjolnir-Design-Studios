// app/forge/page.tsx — Final Perfect Sidebar (Tab polished, gold hover)
"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Settings, 
  User, 
  LogOut, 
  FileText, 
  Mic, 
  Hammer, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Zap,
  Package,
  Sparkles,
  Star
} from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SceneClient from "@/components/three/SceneClient";
import { cn } from "@/lib/utils";

export default function Forge() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_FREE_QUERIES = 3;

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
    setInput(e.target.value);
    resetTimeout();
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    resetTimeout();
  };

  const handleSend = () => {
    if (!input.trim() || queryCount >= MAX_FREE_QUERIES) return;

    const userMsg = input;
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, `THE FORGE HAS SPOKEN:\n\n"${userMsg}"\n\nI have forged your request with the power of Mjolnir:\n• 3D model generated\n• Optimized for printing\n• Ready for export\n\nThunderous work, warrior.`]);
      setQueryCount(prev => prev + 1);
      setIsLoading(false);
    }, 2800);
  };

  const handleVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setInput("Create a glowing Mjolnir hammer");
      setIsListening(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white text-2xl">
        Loading the Forge...
      </div>
    );
  }

  if (!user) return null;

  const forgeCategories = [
    {
      title: "Forge Tools",
      items: [
        { label: "Text Prompt", href: "#", icon: <Zap className="w-6 h-6" /> },
        { label: "Voice Command", href: "#", icon: <Mic className="w-6 h-6" /> },
        { label: "Image Upload", href: "#", icon: <FileText className="w-6 h-6" /> },
        { label: "3D Library", href: "#", icon: <Package className="w-6 h-6" /> },
      ],
    },
    {
      title: "Models",
      items: [
        { label: "My Creations", href: "#", icon: <Sparkles className="w-6 h-6" /> },
        { label: "Community", href: "#", icon: <Star className="w-6 h-6" /> },
      ],
    },
    {
      title: "Print",
      items: [
        { label: "Export STL/GLB", href: "#", icon: <Hammer className="w-6 h-6" /> },
        { label: "Print Queue", href: "#", icon: <Zap className="w-6 h-6" /> },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white relative">
      {/* COLLAPSIBLE SIDEBAR */}
      <motion.aside
        animate={{ width: isSidebarOpen ? "18rem" : "6rem" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed left-0 top-24 bottom-0 z-40 border-r border-white/10 bg-black/95 backdrop-blur-2xl flex flex-col h-[calc(100vh-6rem)]"
      >
        <div className="h-full flex flex-col relative">
          {/* Header: Centered Hammer */}
          <div className="p-6 border-b border-white/10 flex items-center justify-center">
            <motion.div
              animate={{ rotate: isSidebarOpen ? -45 : 0 }}
              transition={{ duration: 0.4 }}
              className="origin-center"
            >
              <Hammer className="w-12 h-12 text-gold drop-shadow-lg" />
            </motion.div>
          </div>

          {/* Toggle Tab - Higher, slightly more to the right, clean gold hover */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "absolute top-8 -right-7 z-50 w-14 h-24 rounded-r-3xl bg-black/95 border border-white/10 border-l-0",
              "flex items-center justify-center hover:bg-gold/20 transition group"
            )}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-7 h-7 text-gray-400 group-hover:text-white" />
            ) : (
              <ChevronRight className="w-7 h-7 text-gray-400 group-hover:text-white" />
            )}
          </button>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-3">
            {forgeCategories.map((category) => (
              <div key={category.title} className="mb-4">
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pl-4"
                    >
                      {category.title}
                    </motion.h3>
                  )}
                </AnimatePresence>
                <ul className="space-y-1.5">
                  {category.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-gold/20 transition group",
                          !isSidebarOpen && "gap-0 px-0 justify-center"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-12 shrink-0 text-gray-400 group-hover:text-white",
                            !isSidebarOpen && "w-full"
                          )}
                        >
                          {item.icon}
                        </div>
                        <AnimatePresence>
                          {isSidebarOpen && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className="text-base group-hover:text-white overflow-hidden"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <motion.main
        className="flex-1 flex flex-col min-w-0"
        animate={{
          paddingLeft: isSidebarOpen ? "18rem" : "6rem",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* NAVBAR */}
        <header className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
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

            <div className="flex items-center gap-4">
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
                          placeholder="Search..."
                          value={input}
                          onChange={handleInputChange}
                          onBlur={() => setTimeout(() => setIsSearchExpanded(false), 200)}
                          autoFocus
                          className="w-full h-full pl-14 pr-8 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:bg-white/15 text-lg"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      type="button"
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

              <button type="button" aria-label="Settings" title="Settings" className="h-14 w-14 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#34D399] group">
                <Settings className="w-6 h-6 text-gray-300 group-hover:text-[#34D399]" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-14 w-14 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#F0FF42] group"
                  aria-label="Profile"
                  title="Profile"
                >
                  <User className="w-6 h-6 text-gray-300 group-hover:text-[#F0FF42]" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
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

              <button
                type="button"
                onClick={handleLogout}
                className="h-14 w-14 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 hover:border-[#FF9900] group"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-6 h-6 text-gray-300 group-hover:text-[#FF9900]" />
              </button>
            </div>
          </div>
        </header>

        {/* FORGE CONTENT */}
        <div className="flex-1 pt-32 flex flex-col">
          <div className="text-center py-8">
            <h1 className="text-5xl md:text-7xl font-black text-white">
              THE MJÖLNIR FORGE
            </h1>
            <p className="text-xl md:text-2xl text-gold mt-3">
              Speak, and it shall be forged!
            </p>
          </div>

          <div className="flex-1 px-8 md:px-20 pb-8">
            <div className="h-full max-w-7xl mx-auto rounded-3xl overflow-hidden border-4 border-gold/30 shadow-2xl shadow-gold/20">
              <SceneClient />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 pb-8 w-full">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 ${i % 2 === 0 ? "text-right" : "text-left"}`}
                >
                  <div className={cn(
                    "inline-block max-w-lg px-6 py-4 rounded-3xl",
                    i % 2 === 0 ? "bg-emerald-600/20 border border-emerald-500/40" : "bg-gold/10 border border-gold/40"
                  )}>
                    <p className="text-white whitespace-pre-wrap">{msg}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto" />
                  <p className="text-gold mt-2">Forging your creation...</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 p-6">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button type="button" aria-label="Upload file" title="Upload file" className="p-4 rounded-full bg-emerald-600/20 border-2 border-emerald-500/60 hover:bg-emerald-600/30 transition group">
                <FileText className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
              </button>

              <button type="button" onClick={handleVoice} aria-label="Voice input" title="Voice input" className="p-4 rounded-full bg-emerald-600/20 border-2 border-emerald-500/60 hover:bg-emerald-600/30 transition group">
                <Mic className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                placeholder="Speak your vision..."
                className="flex-1 px-8 py-5 bg-black/60 border border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition text-lg"
              />

              <button type="button" onClick={handleSend} aria-label="Send message" title="Send message" className="p-4 rounded-full bg-emerald-600/20 border-2 border-emerald-500/60 hover:bg-emerald-600/30 transition group">
                <Hammer className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-4">
              3 free forge credits remaining today!
            </p>
          </div>

          <Footer />
        </div>
      </motion.main>
    </div>
  );
}