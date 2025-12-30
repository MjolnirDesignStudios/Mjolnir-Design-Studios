// components/Footer.tsx — FINAL: 5 COLUMNS + LOGO BELOW SOCIALS
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { socialMedia } from "@/data";

const footerLinks = {
  Company: [
    { name: "About Us", href: "/#about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Team", href: "/team" },
  ],
  Designs: [
    { name: "Animations", href: "/#animations" },
    { name: "Components", href: "/#components" },
    { name: "Engineering", href: "/#engineering" },
    { name: "Icons & Logos", href: "/#icons" },
    { name: "Video", href: "/#video" },
    { name: "Web2/3", href: "/#web3" },
  ],
  Products: [
    { name: "Agentic AI", href: "/forge" },
    { name: "Automations", href: "/automations" },
    { name: "Hammer Tech", href: "/hammer-tech" },
    { name: "Mjolnir Forge", href: "/forge" },
    { name: "MjolnirAI Pro", href: "/pricing" },
    { name: "MjolnirUI Pro", href: "/pricing" },
  ],
  Support: [
    { name: "Blog/Vlog", href: "/blog" },
    { name: "Community", href: "https://discord.gg/mjolnir" },
    { name: "Documentation", href: "/docs" },
    { name: "Email Support", href: "mailto:forge@mjolnirui.com" },
    { name: "Help Center", href: "/help" },
    { name: "FAQ", href: "/faq" },
  ],
  Legal: [
    { name: "Cookie Policy", href: "/legal/cookies" },
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Terms of Service", href: "/legal/terms" },
    { name: "Trademark Policy", href: "/legal/trademark" },
    { name: "Media Kit", href: "/media" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative w-full py-20 bg-neutral-950 border-t border-white/10 overflow-hidden">
      {/* GRID BACKGROUND — MOVED OUTSIDE SECTION */}
      <div className="absolute inset-0 z-10 opacity-20 pointer-events-none">
        <Image
          src="/Images/Backgrounds/footer-grid.svg"
          alt="grid"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* 5 COLUMNS — PERFECTLY CENTERED */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 justify-items-center mb-16">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-6 text-center lg:text-left">
              <h3 className="text-2xl font-black text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-gold transition-colors duration-300 block text-lg"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        

        {/* SOCIAL + LOGO + COPYRIGHT */}
        <div className="flex flex-col items-center gap-10 pt-12 border-t border-white/10">

        {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.25 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full opacity-0"
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.4 }}
                style={{
                  boxShadow: "0 0 80px #00f0ff, 0 0 160px #00f0ff",
                  background: "radial-gradient(circle, #00f0ff44, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <Image
                src="/Assets/mjolnir_logo_transparent.png"
                alt="MjolnirUI"
                width={160}
                height={160}
                className="rounded-full drop-shadow-2xl relative z-10"
                priority
              />
            </motion.div>
          </Link>


          {/* Social Links */}
          <div className="flex gap-6">
            {socialMedia.map((profile) => (
              <motion.a
                key={profile.id}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="w-14 h-14 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center hover:border-gold transition-all duration-300"
              >
                <Image src={profile.img} alt="" width={28} height={28} />
              </motion.a>
            ))}
          </div>


          {/* Copyright */}
          <div className="text-center">
            <p className="text-xl font-bold text-gold">Copyright © 2026 Mjölnir Design Studios LLC</p>
            <p className="text-lg text-gray-400 mt-2">All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}