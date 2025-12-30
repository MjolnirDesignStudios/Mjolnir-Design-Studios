// app/dashboard/page.tsx
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Twitter, Sparkles } from "lucide-react";

export default function DashboardHome() {
  return (
    <>
      {/* Hero Welcome */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome to MjolnirUI Pro
        </h1>
        <p className="text-xl text-gray-400">
          70+ handcrafted components & templates. Copy, paste, ship.
        </p>
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
        {/* Example Component Card */}
        {[
          { title: "Neon Gradient Button", desc: "Glowing animated button with glassmorphism", pro: true },
          { title: "3D Card Tilt", desc: "Vanilla-tilt.js powered interactive cards", pro: true },
          { title: "MacBook Scroll Mockup", desc: "As seen on fey.com – 3D scroll reveal", pro: true },
          { title: "Floating Tooltip Card", desc: "Follows cursor with smooth spring animation", pro: true },
          { title: "Holographic Grid", desc: "Interactive background with mouse parallax", pro: true },
          { title: "Terminal Window", desc: "Typewriter effect + glowing cursor", pro: true },
        ].map((item) => (
          <Card
            key={item.title}
            className="group relative overflow-hidden bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.pro && <Badge className="bg-purple-600">Pro</Badge>}
              </div>
              <p className="text-sm text-gray-400 mb-4">{item.desc}</p>
              <div className="h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-purple-500 opacity-50" />
              </div>
              <Button variant="outline" className="w-full mt-4 group-hover:border-purple-500 group-hover:text-purple-400 transition-colors">
                View Component
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Lifetime Deal Section */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/20 via-zinc-900 to-zinc-900 border-purple-800/50">
        <div className="p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">You’re in — lifetime access activated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            No recurring fees. All future components, templates, and updates are yours forever.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <Twitter className="w-5 h-5" />
            <span>Follow @mjolnirui for new drops every week</span>
          </div>
        </div>
      </Card>
    </>
  );
}