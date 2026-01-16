// app/components/Blocks.tsx — EnergyTunnel Background on Rocket Block
import React from "react";
import { Globe, Rocket, Zap, Hammer, Shield } from "lucide-react";
import ShimmerButton from "@/components/ui/Buttons/ShimmerButton";
import Link from "next/link";
import Image from "next/image";

export default function Blocks() {
  return (
    <section id="blocks" 
      className="py-4 mb-16 relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-5xl lg:text-5xl font-black text-white mb-4">
            Asgardian Tech Forged in <span className="text-gold">Valhalla</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400">
            Wield Powerful Design Technology
          </p>
        </div>

        {/* ACETERNITY BENTO GRID */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-4 lg:gap-4">
          
          {/* 1. Rocket — Large center with EnergyTunnel background */}
          <li className="md:[grid-area:1/4/3/10] lg:[grid-area:1/4/2.2/10]">
            <div className="relative h-full rounded-3xl border border-white/10 overflow-hidden isolate">
              {/* EnergyTunnel Background */}
              <Image
                src="/Images/Backgrounds/EnergyTunnel.jpeg"
                alt="Energy Tunnel"
                fill
                priority
                className="object-cover object-center scale-110"
              />

              {/* Dark overlay for text contrast */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Subtle radial glow */}
              <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl" />

              <div className="relative h-full p-8 md:p-12 flex flex-col items-center justify-center text-center gap-8 z-10">
                <div className="p-10 rounded-3xl bg-gradient-to-br from-purple-800 to-blue-400 shadow-2xl">
                  <Rocket className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl">
                    Build Your Startup!
                  </h3>
                  <p className="text-gold text-xl lg:text-2xl drop-shadow-lg">
                    From Idea to Launch!
                  </p>

                  <Link href="/blocks" className="mt-10 inline-block">
                    <ShimmerButton
                      title="View Blocks"
                      icon={<Zap className="w-6 h-6" />}
                      position="right"
                      otherClasses="mx-auto"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* Rest of boxes — unchanged */}
          <li className="md:[grid-area:1/1/2/4] lg:[grid-area:1/1/1.5/4]">
            <div className="relative h-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center gap-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-green-400 shadow-2xl">
                <Hammer className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white">Build Strategically</h3>
                <p className="text-gold text-lg">Worthy for All Creators</p>
              </div>
            </div>
          </li>

          <li className="md:[grid-area:1/10/2/13] lg:[grid-area:1/10/2/13]">
            <div className="relative h-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center gap-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-green-400 to-yellow-300 shadow-2xl">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white">Powerful UI/UX</h3>
                <p className="text-gold text-lg">Lightning-Fast</p>
              </div>
            </div>
          </li>

          <li className="md:[grid-area:2/1/3/4] lg:[grid-area:2/1/3/4]">
            <div className="relative h-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center gap-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-yellow-300 to-orange-500 shadow-2xl">
                <Globe className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white">Deploy Globally</h3>
                <p className="text-gold text-lg">The World Awaits!</p>
              </div>
            </div>
          </li>

          <li className="md:[grid-area:2/10/3/13] lg:[grid-area:2/10/3/13]">
            <div className="relative h-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center gap-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-400 to-red-700 shadow-2xl">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white">Battle Tested</h3>
                <p className="text-gold text-lg">Forged in Valhalla</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}