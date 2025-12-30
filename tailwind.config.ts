// tailwind.config.ts — MJÖLNIR 2026 — FINAL & UNBREAKABLE
import type { Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { xs: "480px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1400px", "3xl": "1600px" },
    },
    extend: {
      fontFamily: {
        heading: ["var(--font-satoshi)", "system-ui", "sans-serif"],
        body: ["var(--font-ubuntu)", "system-ui", "sans-serif"],
        display: ["var(--font-satoshi)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        gold: 
        { 50: "#fffbeb", 
          100: "#fef3c7", 
          200: "#fde68a", 
          300: "#fcd34d", 
          400: "#fbbf24", 
          500: "#f59e0b", 
          600: "#d97706", 
          700: "#b45309", 
          900: "#78350f", 
          DEFAULT: "#FFCC11" },
        electric: 
        { 100: "#ccfbff", 
          400: "#00f0ff", 
          500: "#00d4bff", 
          600: "#0066ff", 
          700: "#0044cc", 
          DEFAULT: "#00f0ff" },
        storm: 
        { 800: "#0f172a", 
          900: "#020617", 
          950: "#0a0a0f" },

        // THESE ARE THE ONES THAT MAKE border-border, bg-background, etc. WORK
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        chart: { 1: "hsl(var(--chart-1))", 2: "hsl(var(--chart-2))", 3: "hsl(var(--chart-3))", 4: "hsl(var(--chart-4))", 5: "hsl(var(--chart-5))" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
    },
  },
  plugins: [
    animate,
    function ({ addBase, theme }: any) {
      const allColors = flattenColorPalette(theme("colors"));
      const newVars = Object.fromEntries(Object.entries(allColors).map(([k, v]) => [`--${k}`, v]));
      addBase({ ":root": newVars });
    },
  ],
} satisfies Config;

export default config;