// app/blocks/get-started/page.tsx — Get Started / Installation
"use client";

import React from "react";
import UserNavbar from "@/components/layout/UserNavbar";
import UserSidebar from "@/components/layout/UserSidebar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Package, Zap, Terminal } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function GetStarted() {
  const { isOpen } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      <UserNavbar />

      <div className="flex flex-1 pt-24">
        <UserSidebar />

        <motion.main
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
          animate={{ paddingLeft: isOpen ? "18rem" : "6rem" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-950 via-purple-950/5 to-neutral-950">
            <div className="p-10 lg:p-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto"
              >
                {/* Title */}
                <div className="text-center mb-12">
                  <h1 className="text-6xl md:text-8xl font-black text-white">
                    Installation
                  </h1>
                  <p className="text-2xl md:text-3xl text-gold mt-4 max-w-4xl mx-auto leading-relaxed">
                    Get MjolnirUI up and running in seconds.
                  </p>
                </div>

                <div className="space-y-20">
                  {/* NPM Install */}
                  <section>
                    <div className="flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Package className="w-8 h-8 text-black" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-4xl font-bold text-white mb-6">Install via NPM</h2>
                        <p className="text-xl text-gray-300 mb-6">
                          MjolnirUI is distributed as an NPM package. Run the following command in your project directory:
                        </p>
                        <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto">
                          <code className="text-emerald-400 text-lg">npm install mjolnirui</code>
                        </pre>
                        <p className="text-lg text-gray-400 mt-6">
                          Or with yarn/pnpm:
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                          <pre className="bg-black/50 border border-white/10 rounded-xl p-6">
                            <code className="text-cyan-400">yarn add mjolnirui</code>
                          </pre>
                          <pre className="bg-black/50 border border-white/10 rounded-xl p-6">
                            <code className="text-purple-400">pnpm add mjolnirui</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* CLI Tool */}
                  <section>
                    <div className="flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Terminal className="w-8 h-8 text-black" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-4xl font-bold text-white mb-6">CLI (Recommended)</h2>
                        <p className="text-xl text-gray-300 mb-6">
                          Use our CLI to add components instantly — no copy-paste needed.
                        </p>
                        <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto">
                          <code className="text-purple-400 text-lg">npx mjolnirui@latest add [component-name]</code>
                        </pre>
                        <p className="text-lg text-gray-400 mt-6">
                          Example:
                        </p>
                        <pre className="bg-black/50 border border-white/10 rounded-xl p-6 mt-4">
                          <code className="text-emerald-400">npx mjolnirui@latest add hero</code>
                        </pre>
                      </div>
                    </div>
                  </section>

                  {/* Manual Copy-Paste */}
                  <section>
                    <div className="flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Zap className="w-8 h-8 text-black" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-4xl font-bold text-white mb-6">Manual Copy-Paste</h2>
                        <p className="text-xl text-gray-300 mb-6">
                          Prefer full control? Browse the component library and copy the code directly.
                        </p>
                        <Link href="/blocks">
                          <button className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl hover:scale-105 transition shadow-lg">
                            Browse Components
                          </button>
                        </Link>
                      </div>
                    </div>
                  </section>

                  {/* Next Steps */}
                  <section className="text-center py-20">
                    <h2 className="text-5xl font-black text-white mb-8">Ready to Forge?</h2>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Link href="/blocks/get-started/nextjs">
                        <button className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl hover:scale-105 transition shadow-lg">
                          Next.js Setup →
                        </button>
                      </Link>
                      <Link href="/blocks/get-started/tailwind">
                        <button className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-bold rounded-xl hover:scale-105 transition shadow-lg">
                          TailwindCSS Guide →
                        </button>
                      </Link>
                    </div>
                  </section>
                </div>
              </motion.div>
            </div>

            <Footer />
          </div>
        </motion.main>
      </div>
    </div>
  );
}