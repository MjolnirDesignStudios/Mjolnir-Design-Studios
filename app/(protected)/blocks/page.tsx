// app/blocks/page.tsx — Welcome to MjolnirUI Blocks (Main Post-Login Landing)
"use client";

import React from "react";
import UserNavbar from "@/components/layout/UserNavbar";
import UserSidebar from "@/components/layout/UserSidebar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSidebar } from "@/components/layout/SidebarContext"; // Import hook for sidebar state
import { Hammer, Zap } from "lucide-react";

export default function BlocksWelcome() {
  const { isOpen } = useSidebar(); // Get sidebar open/closed state

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
                className="max-w-5xl mx-auto text-center"
              >
                <h1 className="text-6xl md:text-8xl font-black text-white mb-12">
                  Welcome to MjolnirUI
                </h1>

                <div className="prose prose-invert max-w-none text-lg text-gray-300 space-y-8 mx-auto">
                  <p className="text-xl md:text-2xl leading-relaxed">
                    MjolnirUI is a collection reusable Tailwind CSS component blocks forged with the power of Thor's hammer, Mjolnir!. Build mighty animated web experiences with ease and speed.
                  </p>
                  <p className="text-xl md:text-2xl leading-relaxed">
                    This is not just another component library. These blocks are crafted to electrify your web applications — delivering cinematic animations, stunning visuals, and pure performance.
                  </p>

                  <h2 className="text-5xl md:text-6xl font-bold text-white mt-20 mb-10">
                    Our Mission
                  </h2>
                  <p className="text-xl md:text-2xl leading-relaxed">
                    We set out on our quest to forge digital masterpieces worthy of remembrance. We bring the thunder to electrify your modern web design project — building and creating legendary user experiences. Wield the power of MjolnirUI!
                  </p>

                  <p className="text-3xl md:text-4xl text-gold font-black mt-16 mb-12">
                    Mjolnir! A Weapon to Destroy, or a Tool to Build!
                  </p>

                  <blockquote className="border-l-4 border-gold pl-10 italic text-xl md:text-2xl my-16 text-left max-w-4xl mx-auto text-gray-200 leading-relaxed">
                    "Mjolnir Design Studios is a creative design agency headquartered in the fabled realm of Asgard — We blend mythical inspiration with cutting-edge technology to craft thunderous digital solutions."
                  </blockquote>
                </div>

                <div className="mt-20">
                  <Link href="/blocks/get-started">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-16 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-2xl font-bold rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300"
                    >
                      Wield MjolnirUI! <Zap className="inline-block ml-4" />
                    </motion.button>
                  </Link>
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