"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // assuming you have cn helper
import {
  ChevronRight, LayoutDashboard, Zap, Code, Cpu, Coins, Settings, LogOut,
} from "lucide-react";

export function MjolnirSidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={cn(
        "bg-gradient-to-b from-zinc-950 to-black border-r border-zinc-800/50 transition-all duration-300 h-screen sticky top-0 overflow-hidden",
        expanded ? "w-72" : "w-20"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header / Toggle */}
        <div className="p-5 border-b border-zinc-800/50 flex items-center justify-between">
          {expanded && (
            <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
              MJÖLNIR
            </h2>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-zinc-800/50 transition"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronRight
              className={cn(
                "w-5 h-5 text-cyan-400 transition-transform",
                !expanded && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" expanded={expanded} />
          <NavSection
            icon={<Zap />}
            label="Usage & Tokens"
            expanded={expanded}
            items={["Token Balance", "API Usage", "Subscription"]}
          />
          <NavItem icon={<Code />} label="Components" expanded={expanded} />
          <NavItem icon={<Cpu />} label="3D Forge" expanded={expanded} />
          <NavItem icon={<Coins />} label="Bitcoin Tools" expanded={expanded} />
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800/50 mt-auto">
          <NavItem icon={<Settings />} label="Settings" expanded={expanded} />
          <NavItem
            icon={<LogOut />}
            label="Logout"
            expanded={expanded}
            className="text-red-400 hover:text-red-300"
          />
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  expanded,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition text-left",
        className
      )}
    >
      <div className="w-6 h-6 flex items-center justify-center text-cyan-400">{icon}</div>
      {expanded && <span className="font-medium">{label}</span>}
    </button>
  );
}

function NavSection({
  icon,
  label,
  expanded,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  items: string[];
}) {
  const [open, setOpen] = useState(true);

  if (!expanded) {
    return (
      <button className="w-full flex items-center justify-center p-3 hover:bg-zinc-800/50 rounded-xl">
        {icon}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center text-cyan-400">{icon}</div>
          <span className="font-medium">{label}</span>
        </div>
        <ChevronRight className={cn("w-4 h-4 transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <div className="pl-12 space-y-1 mt-1">
          {items.map((item) => (
            <button
              key={item}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-cyan-300 transition"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}