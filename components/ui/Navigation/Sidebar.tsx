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
  Settings,
  Globe,
  Layout,
  FileCode,
  Terminal,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    title: "Get Started",
    openByDefault: true,
    items: [
      { label: "Introduction", href: "/blocks", icon: <Globe className="w-5 h-5" /> },
      { label: "Installation", href: "/blocks/installation", icon: <Download className="w-5 h-5" /> },
      { label: "Next.js Setup", href: "/blocks/installation/nextjs", icon: <FileCode className="w-5 h-5" /> },
      { label: "TailwindCSS", href: "/blocks/installation/tailwind", icon: <Layout className="w-5 h-5" /> },
      { label: "Add Utilities", href: "/blocks/installation/utils", icon: <Zap className="w-5 h-5" /> },
      { label: "CLI", href: "/blocks/installation/cli", icon: <Terminal className="w-5 h-5" /> },
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
      { label: "Navigation", href: "/blocks/navigation", icon: <Globe className="w-5 h-5" /> },
      { label: "Forms", href: "/blocks/forms", icon: <Package className="w-5 h-5" /> },
      { label: "Loaders", href: "/blocks/loaders", icon: <Sparkles className="w-5 h-5" /> },
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
    <aside className="w-80 xl:w-96 border-r border-white/10 bg-black/95 backdrop-blur-2xl h-screen sticky top-0 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-8 border-b border-white/10">
        <Link href="/blocks" className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-gradient-to-br from-gold via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl shadow-gold/40 group-hover:scale-110 transition">
            M
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
              MjolnirUI
            </h1>
            <p className="text-gold text-sm font-bold">Component Forge ⚡</p>
          </div>
        </Link>
      </div>

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
                            "flex items-center justify-between w-full py-3 px-5 rounded-xl text-sm font-medium transition-all relative",
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

      {/* Footer */}
      <div className="p-6 border-t border-white/10 text-center">
        <p className="text-xs text-gray-500">Forged in Valhalla • {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
}