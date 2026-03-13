// data/tech-icons.ts
// This file imports concrete react-icons components.
// Separated from data/index.ts to keep the shared data module SSR-safe.
// DO NOT import this file from server components or API routes.
//
// NOTE: The spec architecture diagram shows techStackIcons in data/index.ts,
// but the spec body text (and SSR safety requirements) place it here.
// This is the intentional resolution of that contradiction.

import {
  SiTypescript,
  SiThreedotjs,
  SiGithub,
  SiNodedotjs,
  SiPostgresql,
  SiCloudflare,
} from "react-icons/si";
import type { TechIcon } from "@/data/index";

export const techStackIcons: TechIcon[] = [
  { name: "React",         svgPath: "/Icons/Technologies/react.svg" },
  { name: "Next.js",       svgPath: "/next.svg" },
  { name: "TypeScript",    reactIcon: SiTypescript },
  { name: "Tailwind",      svgPath: "/Icons/Technologies/tail.svg" },
  { name: "GSAP",          svgPath: "/Icons/Technologies/gsap.svg" },
  { name: "Three.js",      reactIcon: SiThreedotjs },
  { name: "Framer Motion", svgPath: "/Icons/Technologies/fm.svg" },
  { name: "Supabase",      svgPath: "/Icons/Technologies/supabase.svg" },
  { name: "Stripe",        svgPath: "/Icons/Payments/stripe-64.svg" },
  { name: "Vercel",        svgPath: "/vercel.svg" },
  { name: "Docker",        svgPath: "/Icons/Technologies/docker.svg" },
  { name: "Figma",         svgPath: "/Icons/Technologies/figma.svg" },
  { name: "GitHub",        reactIcon: SiGithub },
  { name: "Python",        svgPath: "/Icons/Technologies/python.svg" },
  { name: "JavaScript",    svgPath: "/Icons/Technologies/javascript.svg" },
  { name: "HTML5",         svgPath: "/Icons/Technologies/html.svg" },
  { name: "CSS3",          svgPath: "/Icons/Technologies/css.svg" },
  { name: "Blender",       svgPath: "/Icons/Technologies/blend.svg" },
  { name: "HubSpot",       svgPath: "/Icons/Technologies/hubspot.svg" },
  { name: "Grok",          svgPath: "/Icons/Technologies/grok.svg" },
  { name: "Replit",        svgPath: "/Icons/Technologies/replit.svg" },
  { name: "Node.js",       reactIcon: SiNodedotjs },
  { name: "Cloudflare",    reactIcon: SiCloudflare },
  { name: "PostgreSQL",    reactIcon: SiPostgresql },
  { name: "Anthropic",     initials: "AI" },
];
