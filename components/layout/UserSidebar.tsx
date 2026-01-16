// components/layout/UserSidebar.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Hammer, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  Rocket, 
  Zap, 
  Globe, 
  Sparkles, 
  Star,
  Package,
  LayoutDashboard 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";

const mainSections = [
  { 
    title: "Get Started", 
    href: "/blocks", // Main welcome page
    icon: <Rocket className="w-6 h-6" />, 
    hasSubItems: false 
  },
  { 
    title: "Installations", 
    href: "/blocks/installation", 
    icon: <Package className="w-6 h-6" />, 
    hasSubItems: true,
    subItems: ["Next.js Setup", "Tailwind CSS", "Add Utilities", "CLI Tools (Coming Soon)"]
  },
  { 
    title: "Landing Pages", 
    href: "/blocks/landing-pages", 
    icon: <Zap className="w-6 h-6" />, 
    hasSubItems: true,
    subItems: ["Hero Styles", "Feature Grid", "Testimonials", "Pricing Hero", "FAQ Block"]
  },
  { 
    title: "Templates", 
    href: "/blocks/templates", 
    icon: <Globe className="w-6 h-6" />, 
    hasSubItems: true,
    subItems: ["Accountants", "eCommerce", "Lawyers", "Real Estate", "Restaurants", "Startups"]
  },
  { 
    title: "Dashboards", 
    href: "/blocks/dashboards", 
    icon: <LayoutDashboard className="w-6 h-6" />, 
    hasSubItems: true,
    subItems: ["Analytics Dashboard", "Admin Panel", "E-commerce Dashboard"]
  },
  { 
    title: "Animations", 
    href: "/blocks/animations", 
    icon: <Sparkles className="w-6 h-6" />, 
    hasSubItems: true,
    subItems: ["Fade In", "Slide Up", "Lightning Effect", "Globe Spin", "Particle Burst"]
  },
  { 
    title: "Backgrounds", 
    href: "/blocks/backgrounds", 
    icon: <Star className="w-6 h-6" />, 
    hasSubItems: true,
    subItems: ["Gradient BG", "Particle BG", "Energy Tunnel", "Singularity", "Nebula Flow"]
  },
  { 
    title: "Components", 
    href: "/blocks/components", 
    icon: <Hammer className="w-6 h-6" />, 
    hasSubItems: true,
    subItems: [
      "Buttons", "Cards", "Forms", "Loaders", "Menus", 
      "Modals", "Navigation", "Pagination", "Typography", 
      "Text Effects", "Bento Grid"
    ]
  },
];

export default function UserSidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["Installations", "Landing Pages", "Templates", "Dashboards", "Animations", "Backgrounds", "Components"])
  );
  const pathname = usePathname();

  const toggleSection = (title: string) => {
    setOpenSections((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <motion.aside
      animate={{ width: isOpen ? "18rem" : "6rem" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed left-0 top-24 bottom-0 z-40 border-r border-white/10 bg-black/95 backdrop-blur-2xl flex flex-col"
      style={{ "--sidebar-width": isOpen ? "18rem" : "6rem" } as React.CSSProperties}
    >
      <div className="h-full flex flex-col relative">
        {/* Header Icon */}
        <div className="p-6 border-b border-white/10 flex items-center justify-center">
          <Hammer className="w-12 h-12 text-gold drop-shadow-lg" />
        </div>

        {/* Toggle Tab */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "absolute top-3 -right-14 z-50 w-16 h-20 rounded-r-3xl bg-black/95 border border-white/10 border-l-0",
            "flex items-center justify-center hover:bg-gold/20 transition group"
          )}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="w-8 h-8 text-gray-400 group-hover:text-white" />
          ) : (
            <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-white" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-3">
          {mainSections.map((section) => {
            const isSectionOpen = openSections.has(section.title);
            const isSectionActive = isActive(section.href);

            return (
              <div key={section.title} className="mb-3">
                <button
                  onClick={() => section.hasSubItems && toggleSection(section.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group",
                    isSectionActive && "bg-gold/20",
                    "hover:bg-gold/20",
                    !isOpen && "justify-center"
                  )}
                  {...(section.hasSubItems ? { "aria-expanded": !!isSectionOpen } : {})}
                  type="button"
                >
                  <Link href={section.href} className="flex items-center gap-4 flex-1">
                    <div className={cn(
                      "flex items-center justify-center w-12 text-gray-400 group-hover:text-white",
                      isSectionActive && "text-white"
                    )}>
                      {section.icon}
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="text-base group-hover:text-white overflow-hidden"
                        >
                          {section.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>

                  {isOpen && section.hasSubItems && (
                    <motion.div animate={{ rotate: isSectionOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  )}
                </button>

                {/* Sub-items Dropdown */}
                <AnimatePresence>
                  {isOpen && section.hasSubItems && isSectionOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 space-y-1.5 overflow-hidden"
                    >
                      <ul>
                        {section.subItems?.map((item) => (
                          <li key={item}>
                            <Link
                              href="#" // Replace with actual sub-page routes when created
                              className="flex items-center pl-16 pr-4 py-2.5 rounded-xl hover:bg-gold/10 transition text-sm text-gray-300 hover:text-white"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}