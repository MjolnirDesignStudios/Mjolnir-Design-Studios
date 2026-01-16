// app/(protected)/blocks/dashboard/page.tsx
import { redirect } from "next/navigation";
import { Twitter, Sparkles } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="space-y-16">
      {/* Hero Welcome */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
          Welcome to MjolnirUI Pro
        </h1>
        <p className="text-xl text-gray-300">
          70+ handcrafted thunder-powered components & templates. Copy, paste, dominate.
        </p>
      </div>

      {/* Component Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "Neon Gradient Button", desc: "Glowing animated button with glassmorphism", pro: true },
          { title: "3D Card Tilt", desc: "Interactive 3D tilt on hover", pro: true },
          // ... keep your list
        ].map((item) => (
          <div
            key={item.title}
            className="group relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              {item.pro && (
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                  Pro
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-6 text-sm">{item.desc}</p>
            <div className="h-48 bg-black/50 rounded-xl border border-zinc-800 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-purple-500/30" />
            </div>
            <button className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold rounded-xl hover:brightness-110 transition">
              View Component
            </button>
          </div>
        ))}
      </div>

      {/* Lifetime Deal */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-950/30 via-zinc-950 to-black border border-purple-800/30 rounded-3xl p-10 text-center">
        <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Lifetime Access Activated ⚡
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          No subscriptions. All components, updates, agents, 3D assets — yours forever.
        </p>
        <div className="flex items-center justify-center gap-4 text-gray-400">
          <Twitter className="w-6 h-6" />
          <span>Follow @mjolnirui for weekly thunder drops</span>
        </div>
      </div>
    </div>
  );
}