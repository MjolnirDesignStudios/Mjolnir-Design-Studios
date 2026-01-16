// app/blocks/installation/page.tsx — MjolnirUI Installations Guide
"use client";

import React from "react";
import UserNavbar from "@/components/layout/UserNavbar";
import UserSidebar from "@/components/layout/UserSidebar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Package, 
  Zap, 
  Terminal, 
  Code2, 
  Settings, 
  Copy 
} from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function InstallationsPage() {
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
                {/* Hero Title */}
                <div className="text-center mb-20">
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6">
                    Installations
                  </h1>
                  <p className="text-2xl md:text-3xl text-gold max-w-4xl mx-auto leading-relaxed">
                    From zero to thunder in minutes. Follow these steps to wield MjolnirUI.
                  </p>
                </div>

                <div className="space-y-28">
                  {/* 1. Install Next.js */}
                  <section className="flex items-start gap-12">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Code2 className="w-10 h-10 text-black" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-5xl font-black text-white mb-8">1. Install Next.js with Create Next App</h2>
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Create a new project using the official Next.js template.
                      </p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto">
                        <code className="text-lg">
                          <span className="text-cyan-400">npx</span> <span className="text-emerald-400">create-next-app@latest</span>
                        </code>
                      </pre>

                      <p className="text-xl text-gray-300 mt-10 mb-6 leading-relaxed">
                        On installation, you'll see the following prompts:
                      </p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto">
                        <code className="text-lg text-gray-300">
                          <span className="text-blue-400">What is your project named?</span> <span className="text-emerald-400">my-app</span>
                          <br />
                          <span className="text-blue-400">Would you like to use TypeScript?</span> <span className="text-emerald-400">No</span> / <span className="text-gold">Yes</span>
                          <br />
                          <span className="text-blue-400">Would you like to use ESLint?</span> <span className="text-emerald-400">No</span> / <span className="text-gold">Yes</span>
                          <br />
                          <span className="text-blue-400">Would you like to use Tailwind CSS?</span> <span className="text-emerald-400">No</span> / <span className="text-gold">Yes</span>
                          <br />
                          <span className="text-blue-400">Would you like to use `src/` directory?</span> <span className="text-emerald-400">No</span> / <span className="text-gold">Yes</span>
                          <br />
                          <span className="text-blue-400">Would you like to use App Router? (recommended)</span> <span className="text-emerald-400">No</span> / <span className="text-gold">Yes</span>
                          <br />
                          <span className="text-blue-400">Would you like to customize the default import alias (@/*)?</span> <span className="text-emerald-400">No</span> / <span className="text-gold">Yes</span>
                          <br />
                          <span className="text-blue-400">What import alias would you like configured?</span> <span className="text-emerald-400">@/*</span>
                        </code>
                      </pre>

                      <p className="text-lg text-gray-400 mt-8">
                        We recommend: <span className="text-gold font-bold">Yes</span> for TypeScript, Tailwind CSS, and App Router.
                      </p>

                      <p className="text-xl text-gray-300 mt-10 leading-relaxed">
                        Start the app:
                      </p>
                      <pre className="bg-black/50 border border-white/10 rounded-xl p-6 mt-6">
                        <code className="text-lg">
                          <span className="text-cyan-400">cd</span> <span className="text-emerald-400">my-app</span>
                          <br />
                          <span className="text-cyan-400">npm</span> <span className="text-emerald-400">run dev</span>
                        </code>
                      </pre>
                    </div>
                  </section>

                  {/* 2. Install Tailwind CSS */}
                  <section className="flex items-start gap-12">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Settings className="w-10 h-10 text-black" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-5xl font-black text-white mb-8">2. Install Tailwind CSS</h2>
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        MjolnirUI supports both Tailwind CSS v4 (recommended) and v3.
                      </p>

                      <h3 className="text-3xl font-bold text-white mb-6">Tailwind CSS v4 Installation</h3>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto mb-8">
                        <code className="text-lg">
                          <span className="text-cyan-400">npm install</span> <span className="text-emerald-400">tailwindcss @tailwindcss/postcss @tailwindcss/cli</span>
                        </code>
                      </pre>

                      <p className="text-xl text-gray-300 mb-6">Create your CSS file (e.g., app/globals.css):</p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto mb-8">
                        <code className="text-emerald-400 text-lg">
{`@import "tailwindcss";

@theme inline {
  /* Configure your theme variables here */
  --font-display: "Inter", "sans-serif";
  --color-primary-500: oklch(0.84 0.18 117.33);
  --spacing: 0.25rem;
}`}
                        </code>
                      </pre>

                      <p className="text-xl text-gray-300 mb-6">Configure PostCSS:</p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto mb-12">
                        <code className="text-emerald-400 text-lg">
{`module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};`}
                        </code>
                      </pre>

                      <h3 className="text-3xl font-bold text-white mb-6">Tailwind CSS v3 Installation (Legacy)</h3>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto mb-8">
                        <code className="text-lg">
                          <span className="text-cyan-400">npm install -D</span> <span className="text-emerald-400">tailwindcss postcss autoprefixer</span>
                          <br />
                          <span className="text-cyan-400">npx</span> <span className="text-emerald-400">tailwindcss init -p</span>
                        </code>
                      </pre>

                      <p className="text-xl text-gray-300 mb-6">Add the Tailwind directives to your globals.css:</p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto">
                        <code className="text-emerald-400 text-lg">
{`@tailwind base;
@tailwind components;
@tailwind utilities;`}
                        </code>
                      </pre>
                    </div>
                  </section>

                  {/* 3. Install MjolnirUI */}
                  <section className="flex items-start gap-12">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Package className="w-10 h-10 text-black" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-5xl font-black text-white mb-8">3. Install MjolnirUI</h2>
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Add the core MjolnirUI package — includes all components, animations, and utilities.
                      </p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto">
                        <code className="text-lg">
                          <span className="text-cyan-400">npm install</span> <span className="text-emerald-400">mjolnirui</span>
                        </code>
                      </pre>
                    </div>
                  </section>

                  {/* 4. Add Utilities */}
                  <section className="flex items-start gap-12">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Zap className="w-10 h-10 text-black" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-5xl font-black text-white mb-8">4. Add Utilities</h2>
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Install dependencies and add the cn utility for className merging.
                      </p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto mb-8">
                        <code className="text-lg">
                          <span className="text-cyan-400">npm i</span> <span className="text-emerald-400">motion clsx tailwind-merge</span>
                        </code>
                      </pre>

                      <p className="text-xl text-gray-300 mb-6">Create lib/utils.ts:</p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto">
                        <code className="text-emerald-400 text-lg">
{`import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
                        </code>
                      </pre>
                    </div>
                  </section>

                  {/* 5. Use the CLI */}
                  <section className="flex items-start gap-12">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Terminal className="w-10 h-10 text-black" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-5xl font-black text-white mb-8">5. Use the CLI (Recommended)</h2>
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        The fastest way to add components — no browsing or copying needed.
                      </p>

                      <h3 className="text-3xl font-bold text-white mb-6">Initialization</h3>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto mb-8">
                        <code className="text-lg">
                          <span className="text-cyan-400">npx</span> <span className="text-emerald-400">mjolnirui@latest init</span>
                        </code>
                      </pre>

                      <h3 className="text-3xl font-bold text-white mb-6">Add Components</h3>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto mb-8">
                        <code className="text-lg">
                          <span className="text-cyan-400">npx</span> <span className="text-emerald-400">mjolnirui@latest add [component-name]</span>
                        </code>
                      </pre>

                      <p className="text-lg text-gray-400 mt-6">Examples:</p>
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <pre className="bg-black/50 border border-white/10 rounded-xl p-6">
                          <code className="text-lg">
                            <span className="text-cyan-400">npx</span> <span className="text-emerald-400">mjolnirui@latest add hero</span>
                          </code>
                        </pre>
                        <pre className="bg-black/50 border border-white/10 rounded-xl p-6">
                          <code className="text-lg">
                            <span className="text-cyan-400">npx</span> <span className="text-emerald-400">mjolnirui@latest add bento-grid</span>
                          </code>
                        </pre>
                      </div>

                      <h3 className="text-3xl font-bold text-white mb-6 mt-12">Registry Setup (Advanced)</h3>
                      <p className="text-xl text-gray-300 mb-6">
                        Add to your components.json:
                      </p>
                      <pre className="bg-black/50 border border-white/10 rounded-2xl p-8 overflow-x-auto">
                        <code className="text-emerald-400 text-lg">
{`{
  "registries": {
    "@mjolnirui": "https://ui.mjolnirdesignstudios.com/registry/{name}.json"
  }
}`}
                        </code>
                      </pre>
                      <p className="text-xl text-gray-300 mt-6">
                        Then install with:
                      </p>
                      <pre className="bg-black/50 border border-white/10 rounded-xl p-6 mt-4">
                        <code className="text-lg">
                          <span className="text-cyan-400">npx</span> <span className="text-emerald-400">mjolnirui@latest add @mjolnirui/electric-border</span>
                        </code>
                      </pre>
                    </div>
                  </section>

                  {/* 6. Manual Copy-Paste */}
                  <section className="flex items-start gap-12">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Copy className="w-10 h-10 text-black" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-5xl font-black text-white mb-8">6. Manual Copy-Paste</h2>
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Prefer full control? Browse the library and copy components directly.
                      </p>
                      <Link href="/blocks">
                        <button className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xl font-bold rounded-xl hover:scale-105 transition shadow-lg">
                          Browse All Components →
                        </button>
                      </Link>
                    </div>
                  </section>

                  {/* Final CTA */}
                  <section className="text-center py-24 bg-black/30 rounded-3xl border border-gold/20">
                    <h2 className="text-6xl font-black text-white mb-8">You Are Ready</h2>
                    <p className="text-2xl text-gold mb-12 max-w-3xl mx-auto">
                      The power of Mjolnir flows through you. Go forth and forge legendary experiences.
                    </p>
                    <Link href="/blocks">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-20 py-7 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-3xl font-bold rounded-full shadow-2xl hover:shadow-emerald-500/70 transition-all"
                      >
                        Start Building Now →
                      </motion.button>
                    </Link>
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