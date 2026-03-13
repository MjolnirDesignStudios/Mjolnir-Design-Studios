// app/blocks/page.tsx — Welcome to Mjolnir Design Studios Projects
"use client";

import React from "react";
import UserNavbar from "@/components/layout/UserNavbar";
import UserSidebar from "@/components/layout/UserSidebar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";
// import BackgroundStudio from "@/components/ui/BackgroundStudio";

export default function ProjectsWelcome() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      <UserNavbar />

      {/* <BackgroundStudio className="fixed inset-0 -z-10" showControls={false} /> */}

      <div className="flex flex-1 pt-24">
        <UserSidebar />

        <main className="flex-1 flex flex-col min-w-0 ml-20 overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-950 via-purple-950/5 to-neutral-950">
            <div className="p-10 lg:p-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto text-center"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, type: "spring", stiffness: 200 }}
                  className="text-6xl md:text-8xl font-black text-white mb-12"
                >
                  Mjolnir for <span className="text-gold">StartUps</span>
                </motion.h1>

                <div className="prose prose-invert max-w-none text-lg text-gray-300 space-y-8 mx-auto">
                  <p className="text-xl md:text-2xl leading-relaxed">
                    Welcome to your Mjolnir Design Studios project dashboard. Here you'll find all the tools and resources for managing your digital business development projects.
                  </p>
                  <p className="text-xl md:text-2xl leading-relaxed">
                    From client onboarding to project delivery, OdinAI-powered consulting to workshop management — everything you need to build legendary digital experiences.
                  </p>

                  <h2 className="text-5xl md:text-6xl font-bold text-white mt-20 mb-10">
                    Our Services
                  </h2>
                  <p className="text-xl md:text-2xl leading-relaxed">
                    We specialize in business consulting, digital development, and premium design services. Whether you're a startup seeking guidance or an enterprise needing custom solutions, our team brings the thunder to electrify your business goals.
                  </p>

                  <p className="text-3xl md:text-4xl text-gold font-black mt-16 mb-12">
                    Mjolnir! A Weapon to Destroy, or a Tool to Build!
                  </p>

                  <blockquote className="border-l-4 border-gold pl-10 italic text-xl md:text-2xl my-16 text-left max-w-4xl mx-auto text-gray-200 leading-relaxed">
                    &ldquo;Mjolnir Design Studios is a creative design agency headquartered in the fabled realm of Asgard — We blend mythical inspiration with cutting-edge technology to craft thunderous digital solutions.&rdquo;
                  </blockquote>
                </div>

                <div className="mt-20">
                  <Link href="/forge">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-16 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-2xl font-bold rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300"
                    >
                      Start Your Project <Zap className="inline-block ml-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}