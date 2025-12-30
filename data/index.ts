// data/index.ts — FINAL & SAFE
export const navItems = [
  { name: "About", link: "/#about" },
  { name: "Blocks", link: "/#blocks" },
  { name: "Forge", link: "/forge" },
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
  { id: 1, name: "", img: "", nameImg: "" },
  { id: 2, name: "", img: "", nameImg: "" },
  { id: 3, name: "", img: "/host.svg", nameImg: "/hostName.svg" },
  { id: 4, name: "", img: "", nameImg: "" },
  { id: 5, name: "", img: "/dock.svg", nameImg: "/dockerName.svg" },
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
    name: "Christopher 'Master' Chiodo",
    role: "Founder & President",
    description: "The visionary leader of Mjolnir Design Studios...",
    avatar: "/Images/avatar-hero.jpg",
    experience: "15+ years in UI/UX and Web Dev",
    skills: ["bitcoin", "gsap", "three", "re", "ts"]
  },
  {
    id: 2,
    name: "Thor Odinson",
    role: "Senior Web Developer",
    description: "Thor brings years of experience in business and finance roles over many decades. Thor specializes in business operations, financial system management, and technology solutions which will allow Mjolnir to withstand the test of time.",
    avatar: "/Images/thor-avatar.jpg", // Placeholder
    experience: "10 years in Web Development",
    skills: ["html", "css", "fm", "re", "ts"]
  },
  {
    id: 3,
    name: "Loki Laufeyson",
    role: "Vice President & Creative Director",
    description: "Loki, clever and innovative in his craft. Digital magic is his specialty and he brings mischief and mastery to every initiative.",
    avatar: "/Images/loki-avatar.jpg", // Placeholder; add to public/images
    experience: "8 years in Creative Direction",
    skills: ["docker","figma", "next", "tail"]
  },
  {
    id: 4,
    name: "Balder the Brave",
    role: "Senior UI/UX Designer",
    description: "Sif crafts intuitive interfaces with a focus on user experience, blending artistry and functionality in every pixel.",
    avatar: "/Images/sif-avatar.jpg", // Placeholder
    experience: "7 years in UI/UX",
    skills: ["blender","javascript","python", "replit"]
  },
  {
    id: 5,
    name: "Beta Ray Bill",
    role: "Senior Video & Animation Specialist",
    description: "Bill produces stunning videos and animations, with an eye for detail that captures every nuance.",
    avatar: "/Images/bill-avatar.jpg", // Placeholder
    experience: "9 years in Video Production",
    skills: ["gsap","fm","supabase","three",]
  }
];