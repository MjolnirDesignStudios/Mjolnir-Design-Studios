// components/ui/Navigation/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, 
  ChevronRight, 
  Package, 
  Sparkles, 
  Zap, 
  Hammer, 
  Palette,
  Download,
  Globe,
  Layout,
  FileCode,
  Terminal,
  Star,
  Bitcoin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SponsorshipBanner from "../Banners/SponsorshipBanner";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  new?: boolean;
  soon?: boolean;
}

interface Category {
  title: string;
  items: NavItem[];
  openByDefault?: boolean;
}

const categories: Category[] = [
  {
    title: "Build",
    openByDefault: true,
    items: [
      { label: "Introduction", href: "/build", icon: <Globe className="w-5 h-5" /> },
      { label: "Installation", href: "/build/installation", icon: <Download className="w-5 h-5" /> },
      { label: "Next.js Setup", href: "/build/installation/nextjs", icon: <FileCode className="w-5 h-5" /> },
      { label: "TailwindCSS", href: "/build/installation/tailwind", icon: <Layout className="w-5 h-5" /> },
      { label: "Add Utilities", href: "/build/installation/utils", icon: <Zap className="w-5 h-5" /> },
      { label: "CLI", href: "/build/installation/cli", icon: <Terminal className="w-5 h-5" /> },
    ],
  },
  {
    title: "Landing Pages",
    items: [
      { label: "Hero Styles", href: "/blocks/landing/hero", icon: <Star className="w-5 h-5" />, new: true },
      { label: "Feature Grid", href: "/blocks/landing/features", icon: <Package className="w-5 h-5" /> },
      { label: "Testimonials", href: "/blocks/landing/testimonials", icon: <Sparkles className="w-5 h-5" /> },
      { label: "Pricing Hero", href: "/blocks/landing/pricing", icon: <Hammer className="w-5 h-5" /> },
      { label: "FAQ Block", href: "/blocks/landing/faq", icon: <Palette className="w-5 h-5" /> },
    ],
  },
  {
    title: "Templates",
    items: [
      { label: "Base Templates", href: "/blocks/templates/base", icon: <Package className="w-5 h-5" /> },
      { label: "Pro Templates", href: "/blocks/templates/pro", icon: <Sparkles className="w-5 h-5" />, new: true },
      { label: "Elite Templates", href: "/blocks/templates/elite", icon: <Star className="w-5 h-5" />, soon: true },
    ],
  },
  {
    title: "Animations",
    items: [
      { label: "All Animations", href: "/blocks/animations", icon: <Sparkles className="w-5 h-5" />, new: true },
    ],
  },
  {
    title: "Backgrounds",
    items: [
      { label: "All Backgrounds", href: "/blocks/backgrounds", icon: <Star className="w-5 h-5" />, new: true },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Buttons", href: "/blocks/buttons", icon: <Zap className="w-5 h-5" /> },
      { label: "Cards", href: "/blocks/cards", icon: <Hammer className="w-5 h-5" /> },
      { label: "Forms", href: "/blocks/forms", icon: <Package className="w-5 h-5" /> },
      { label: "Loaders", href: "/blocks/loaders", icon: <Sparkles className="w-5 h-5" /> },
      { label: "Menus", href: "/blocks/menus", icon: <Palette className="w-5 h-5" /> },
      { label: "Modals", href: "/blocks/modals", icon: <Layout className="w-5 h-5" /> },
      { label: "Navigation", href: "/blocks/navigation", icon: <Globe className="w-5 h-5" /> },
      { label: "Pagination", href: "/blocks/pagination", icon: <Star className="w-5 h-5" /> },
      { label: "Typography", href: "/blocks/typography", icon: <FileCode className="w-5 h-5" /> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => 
    new Set(categories.filter(c => c.openByDefault).map(c => c.title))
  );

  const toggleCategory = (title: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <aside className="w-80 xl:w-96 border-r border-white/10 bg-black/95 backdrop-blur-2xl flex flex-col overflow-hidden -mt-28">
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-6 space-y-8">
        {categories.map((category) => {
          const isOpen = openCategories.has(category.title);

          return (
            <div key={category.title}>
              <button
                onClick={() => toggleCategory(category.title)}
                className="flex items-center justify-between w-full py-4 px-4 rounded-xl hover:bg-white/5 transition-all group"
              >
                <span className="text-xl font-bold text-gray-300 group-hover:text-white">
                  {category.title}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-gold" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {isOpen && (
                <ul className="mt-3 space-y-2 border-l-2 border-gold/30 ml-8 pl-6">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.soon ? "#" : item.href}
                          className={cn(
                            "flex items-center justify-between w-full py-2 px-6 rounded-xl text-sm font-medium transition-all relative",
                            isActive
                              ? "bg-gradient-to-r from-gold/20 to-yellow-600/20 text-gold border border-gold/40 shadow-lg shadow-gold/20"
                              : "text-gray-400 hover:text-white hover:bg-white/5",
                            item.soon && "opacity-50 pointer-events-none"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.new && (
                              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-xs font-bold px-3 py-1 rounded-full">
                                NEW
                              </span>
                            )}
                            {item.soon && (
                              <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">
                                Soon
                              </span>
                            )}
                          </div>
                          {isActive && (
                            <div className="absolute left-0 w-1 h-full bg-gold rounded-r-full" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sponsorship Banner */}
      <div className="p-6 border-t border-white/10">
        <SponsorshipBanner />
      </div>

      {/* Upgrade Buttons */}
      <div className="p-6 border-t border-white/10 space-y-4">
        <Link href="/pricing" className="block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            Upgrade to Pro
          </motion.button>
        </Link>

        <Link href="/pricing" className="block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300"
          >
            <Hammer className="w-5 h-5" />
            Upgrade to Elite
          </motion.button>
        </Link>

        <Link href="/pricing" className="block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300"
          >
            <Bitcoin className="w-5 h-5" />
            Upgrade to Bitcoin
          </motion.button>
        </Link>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 text-center">
        <p className="text-xs text-gray-500">Forged in Valhalla • 2026</p>
      </div>
    </aside>
  );
}