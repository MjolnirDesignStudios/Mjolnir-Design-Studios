// data/index.ts — FINAL & SAFE
import type { ComponentType } from "react";
export const navItems = [
  { name: "About", link: "/#about" },
  { name: "Build", link: "/#build" },
  { name: "Forge", link: "/#forge" },
  { name: "Pricing", link: "/#pricing" },
  { name: "Tech", link: "/#tech" },
];

export type ContentType =
  | "mjolnir"
  | "galactic"
  | "tech-stack"
  | "lightning"
  | "midgard"
  | "bifrost";

export type GridItem = {
  id: number;
  title: string;
  description: string;
  className: string;
  imgClassName?: string;
  titleClassName: string;
  img?: string;
  direction: "left" | "right";
  contentType: ContentType;
  animation?: {
    intensity?: "low" | "medium" | "high" | "epic";
    gradient?: boolean;
    particles?: boolean;
    confettiOnClick?: boolean;
    glow?: boolean;
    bifrost?: boolean;
  };
};

export const gridItems: GridItem[] = [
  {
    id: 1,
    title: "Electric!",
    description: "Thunderous UI/UX!",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[40vh]",
    titleClassName: "justify-end text-[#A9A9A9]",
    img: "",
    direction: "left",
    contentType: "lightning",
    animation: {
      intensity: "epic",
      glow: true,
    },
  },
  {
    id: 2,
    title: "Other Worldly",
    description: "Galatic Power!",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    titleClassName: "justify-start pt-12 pl-10 text-left",
    direction: "right",
    contentType: "galactic",
    animation: {
      intensity: "medium",
      particles: true,
    },
  },
  {
    id: 3,
    title: "Asgardian Tech!",
    description: "Verily!",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    titleClassName: "justify-center",
    direction: "right",
    contentType: "tech-stack",
    animation: {
      intensity: "high",
    },
  },
  {
    id: 4,
    title: "A Tool to Build...",
    description: "Mighty Designs!",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    titleClassName: "justify-start",
    direction: "left",
    contentType: "mjolnir",
    animation: {
      intensity: "high",
    },
  },
  {
    id: 5,
    title: "Premium Innovation",
    description: "For Midgard!",
    className: "md:col-span-3 md:row-span-2 lg:min-h-[50vh]",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    direction: "right",
    contentType: "midgard",
    animation: {
      intensity: "medium",
      glow: true,
    },
  },
  {
    id: 6,
    title: "Open the BiFrost!",
    description: "to contact Mjolnir Design Studios",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    direction: "left",
    contentType: "bifrost",
    animation: {
      intensity: "high",
      bifrost: true,
      confettiOnClick: true,  // For CoolMode particles on click
    },
  },
];

// ────────────────────────────────────────────────────────────────
// REST OF YOUR DATA (unchanged)
// ────────────────────────────────────────────────────────────────
export const companies = [
  { id: 1, name: "docker", img: "/docker.svg", nameImg: "/docker.svg" },
  { id: 2, name: "figma", img: "/figma.svg", nameImg: "/figma.svg" },
  { id: 2, name: "gsap", img: "/gsap.svg", nameImg: "/gsap.svg" },
  { id: 3, name: "hostinger", img: "/host.svg", nameImg: "/hostName.svg" },
  { id: 3, name: "hubspot", img: "/hubspot.svg", nameImg: "/hubspot.svg" },
  { id: 4, name: "meshy", img: "/meshy.svg", nameImg: "/meshy.svg" },
  { id: 5, name: "supabase", img: "/supabase.svg", nameImg: "/supabase.svg" },
];

export const socialMedia = [
  { id: 1, img: "/Icons/Socials/fb-white.svg", link: "https://facebook.com/mjolnirdesignstudios" },
  { id: 2, img: "/Icons/Socials/git-white.svg", link: "https://github.com/mjolnirdesignstudios" },
  { id: 3, img: "/Icons/Socials/instagram-white.svg", link: "https://instagram.com/mjolnirdesignstudios" },
  { id: 4, img: "/Icons/Socials/tiktok-white.svg", link: "https://tiktok.com/@mjolnirdesignstudios" },
  { id: 5, img: "/Icons/Socials/youtube-white.svg", link: "https://youtube.com/@mjolnirdesignstudios" },
  { id: 6, img: "/Icons/Socials/x-white.svg", link: "https://x.com/mjolnirdesignsx" },
];

export const skills = [
  "AnimeJS", "CSS", "Figma", "Framer Motion", "GSAP", "HTML5", "JavaScript", "ThreeJS",
  "React", "Next.js", "Node.js", "Tailwind CSS", "TypeScript", "UI/UX Design", "Vibe"
];

export const teamMembers = [
  {
    id: 1,
    name: "Hammr",
    role: "Founder & President",
    description: "The visionary leader of Mjolnir Design Studios...",
    avatar: "/Images/avatar-hero.jpg",
    experience: "15+ years in engineering, finance, and web development",
    skills: ["bitcoin", "gsap", "python", "react", "three", "ts"]
  },
  {
    id: 2,
    name: "Heimdall",
    role: "Senior Web Developer",
    description: "Heimdall brings years of experience in business and finance roles over many decades. Heimdall specializes in business operations, financial system management, and technology solutions which allow Mjolnir to forge the future.",
    avatar: "/Images/heimdall-avatar.jpg", // Placeholder
    experience: "10 years in Web Development",
    skills: ["html", "css", "fm", "re", "ts"]
  },
  {
    id: 3,
    name: "Bildr",
    role: "Vice President & Creative Director",
    description: "Bildr, clever and innovative in his craft. Digital AI magic is his specialty and he brings mischief and mastery to every initiative.",
    avatar: "/Images/bildr-avatar.jpg", // Placeholder; add to public/images
    experience: "8 years in Creative Direction",
    skills: ["docker", "figma", "next", "tail"]
  },
  {
    id: 4,
    name: "Desi",
    role: "Senior UI/UX Designer",
    description: "Desi's intuitive AI brain interfaces between animation blending artistry and functionality in every pixel.",
    avatar: "/Images/desi-avatar.jpg", // Placeholder
    experience: "7 years in UI/UX",
    skills: ["blender","javascript","python", "replit"]
  },
  {
    id: 5,
    name: "Graf",
    role: "Graphics Specialist",
    description: "Graf produces stunning animations, images, graphics, and video content for your business. Graf is the new Gold, powering your creative imagination with GrafAI.",
    avatar: "/Images/graf-avatar.jpg", // Placeholder
    experience: "Trained on 5 years of video content creation data",
    skills: ["gsap","figma","unity","three",]
  }
];

// ────────────────────────────────────────────────────────────────
// TECH FLIP GRID — types + gradient constants
// ────────────────────────────────────────────────────────────────

export type TechIcon = {
  name: string;
  svgPath?: string;
  /** react-icons component — e.g. SiReact from react-icons/si */
  reactIcon?: ComponentType<{ size?: number; color?: string; className?: string }>;
  /** 2–3 character fallback badge text */
  initials?: string;
};

/** Six Bifrost gradient CSS strings, randomly assigned per card flip. */
export const BIFROST_GRADIENTS: string[] = [
  "linear-gradient(135deg, #7C3AED, #4F46E5)", // Electric Purple
  "linear-gradient(135deg, #0EA5E9, #2563EB)", // Electric Blue
  "linear-gradient(135deg, #10B981, #16A34A)", // Electric Green
  "linear-gradient(135deg, #EAB308, #D4AF37)", // Electric Gold
  "linear-gradient(135deg, #F97316, #EA580C)", // Electric Orange
  "linear-gradient(135deg, #EF4444, #DC2626)", // Electric Red
];

/** Inward glow color per gradient (start color at 19% opacity). */
export const BIFROST_GLOWS: string[] = [
  "#7C3AED30",
  "#0EA5E930",
  "#10B98130",
  "#EAB30830",
  "#F9731630",
  "#EF444430",
];