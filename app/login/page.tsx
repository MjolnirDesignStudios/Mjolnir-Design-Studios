// app/login/page.tsx
"use client";

import React from "react";
import { supabaseClient } from "@/lib/supabase/client";
import Navbar from "@/components/ui/Navigation/Navbar";
import { FloatingNav } from "@/components/ui/Navigation/FloatingNav";
import Footer from "@/components/Footer";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const signInWithGitHub = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/blocks`,
      },
    });
  };

  const signInWithTwitter = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: `${window.location.origin}/blocks`,
      },
    });
  };

  const signInWithWeb3 = async () => {
    // This will auto-detect MetaMask (Ethereum) or Phantom/Solflare (Solana)
    const { data, error } = await supabaseClient.auth.signInWithWeb3({});
    if (error) {
      console.error("Web3 login error:", error);
      alert("Web3 wallet connection failed. Make sure your wallet is installed.");
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white flex flex-col">
      <Navbar />
      <FloatingNav />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4">MjolnirUI Login</h1>
          <p className="text-xl text-gray-400">Sign in to wield the power of Asgardian components</p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-sm">
          {/* GitHub */}
          <button
            onClick={signInWithGitHub}
            className="flex items-center justify-center gap-4 rounded-full border border-white/20 bg-black/80 px-10 py-5 text-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>

          {/* X (Twitter) */}
          <button
            onClick={signInWithTwitter}
            className="flex items-center justify-center gap-4 rounded-full border border-white/20 bg-black/80 px-10 py-5 text-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Sign in with X
          </button>

          {/* Web3 Wallet Button */}
          <button
            onClick={signInWithWeb3}
            className="flex flex-col items-center justify-center gap-2 rounded-full border border-white/20 bg-black/80 px-10 py-6 text-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-gold" />
              <span>Sign in with Web3 Wallet</span>
            </div>
            <p className="text-sm text-gold font-medium flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Web3 Wallet Coming Soon!
            </p>
          </button>
        </div>

        <p className="mt-12 text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </main>

      <Footer />
    </div>
  );
}