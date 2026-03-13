# Tech Stack Flip Grid Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `TechMarquee` scroll in `Tech.tsx` with a Coinbase-style 3D flip card grid (8×3 desktop / 4×3 mobile) where each card independently flips on a staggered timer revealing a new tech icon + Bifrost gradient.

**Architecture:** Three new focused files (`FlipCard` — pure presentational, `TechCardGrid` — owns all timer/state logic, `data/tech-icons.ts` — client-safe icon array) drop into an unchanged `Tech.tsx` shell. Gradient constants and `TechIcon` type live in `data/index.ts`. No new npm dependencies.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v3, CSS 3D transforms, react-icons/si (already installed), IntersectionObserver API

**Spec:** `docs/superpowers/specs/2026-03-12-tech-flip-grid-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `data/index.ts` | Add `TechIcon` type, `BIFROST_GRADIENTS`, `BIFROST_GLOWS` (no React/client imports) |
| Create | `data/tech-icons.ts` | `techStackIcons[]` array with react-icons imports (`"use client"` safe) |
| Create | `components/ui/Cards/FlipCard.tsx` | Purely presentational 3D flip card — zero logic |
| Create | `components/ui/Cards/TechCardGrid.tsx` | Grid layout, per-card timers, pool management, IntersectionObserver |
| Modify | `components/Tech.tsx` | Remove `TechMarquee`, `RandomMotionIcon`, `techIcons`, `h3`; mount `TechCardGrid` |

---

## Chunk 1: Data Layer

### Task 1: Add type + constants to `data/index.ts`

**Files:**
- Modify: `data/index.ts` (append after all existing exports — do NOT alter existing exports)

- [ ] **Step 1: Append to `data/index.ts`**

Add at the very bottom of the file:

```ts
// ────────────────────────────────────────────────────────────────
// TECH FLIP GRID — types + gradient constants
// No React or client-only imports in this file.
// ────────────────────────────────────────────────────────────────
// Using `import type { ComponentType }` rather than `import React` + `React.ComponentType`
// because a bare namespace import of React here would be flagged as unused by the linter.
// `ComponentType<...>` is identical to `React.ComponentType<...>` at the type level.
import type { ComponentType } from "react";

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
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add data/index.ts
git commit -m "feat(data): add TechIcon type and BIFROST_GRADIENTS constants"
```

---

### Task 2: Create `data/tech-icons.ts`

This file imports concrete react-icons components (client-side only). Separating it from `data/index.ts` keeps the shared data module SSR-safe.

> **Spec discrepancy note:** The spec's architecture diagram shows `techStackIcons[]` as an export of `data/index.ts`. However, the spec body text states only type + gradient constants belong there (to avoid client-only imports). This plan follows the body text for SSR safety. `techStackIcons` lives in `data/tech-icons.ts`.

**Files:**
- Create: `data/tech-icons.ts`

- [ ] **Step 1: Create `data/tech-icons.ts`**

```ts
// data/tech-icons.ts
// "use client" is not required here — this file exports data only,
// not a React component. The react-icons imports are plain ComponentType
// references, which are safe in module scope as long as they are rendered
// inside a "use client" component (TechCardGrid).
// DO NOT import this file from server components or API routes.

import {
  SiTypescript,
  SiThreedotjs,
  SiGithub,
  SiNodedotjs,
  SiPostgresql,
  SiHubspot,
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
  { name: "HubSpot",       reactIcon: SiHubspot },
  { name: "Replit",        svgPath: "/Icons/Technologies/replit.svg" },
  { name: "Node.js",       reactIcon: SiNodedotjs },
  { name: "Cloudflare",    reactIcon: SiCloudflare },
  { name: "PostgreSQL",    reactIcon: SiPostgresql },
  { name: "Anthropic",     initials: "AI" },
];
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add data/tech-icons.ts
git commit -m "feat(data): add techStackIcons array (react-icons separated from index.ts)"
```

---

## Chunk 2: FlipCard Component

### Task 3: Create `FlipCard` — pure presentational 3D card

**Files:**
- Create: `components/ui/Cards/FlipCard.tsx`

Zero logic. Receives the `transform` string from parent and applies it directly. All three behavioral props drive rendered output:
- `isFlipping` → sets `pointerEvents: none` on the card wrapper (prevents hover events mid-animation)
- `flipAxis` → written to `data-flip-axis` attribute (enables CSS selector targeting and future conditional styling)
- `flipDirection` → written to `data-flip-direction` attribute (same reason)

- [ ] **Step 1: Create `components/ui/Cards/FlipCard.tsx`**

```tsx
// components/ui/Cards/FlipCard.tsx
"use client";

import React from "react";
import type { TechIcon } from "@/data/index";

export type FlipCardProps = {
  icon: TechIcon;
  gradient: string;
  glowColor: string;
  /** Which axis this card is currently flipping on */
  flipAxis: "X" | "Y";
  /** Direction of rotation: 1 = positive angle, -1 = negative angle */
  flipDirection: 1 | -1;
  /** True while the flip animation is in progress */
  isFlipping: boolean;
  /** CSS transform string — set by TechCardGrid, applied directly */
  transform: string;
  /** When false, CSS transition is disabled (during instant Phase 2 reset) */
  transitionEnabled: boolean;
};

export function FlipCard({
  icon,
  gradient,
  glowColor,
  isFlipping,
  flipAxis,    // passed through for data attribute and future conditional styling
  flipDirection, // passed through for data attribute and future conditional styling
  transform,
  transitionEnabled,
}: FlipCardProps) {
  const renderIcon = () => {
    if (icon.svgPath) {
      return (
        <img
          src={icon.svgPath}
          width={48}
          height={48}
          alt={icon.name}
          style={{
            filter: "brightness(0) invert(1)",
            objectFit: "contain",
            width: 48,
            height: 48,
          }}
        />
      );
    }
    if (icon.reactIcon) {
      const Icon = icon.reactIcon;
      return <Icon size={48} color="white" />;
    }
    if (icon.initials) {
      const fontSize = icon.initials.length <= 2 ? "1.5rem" : "1.1rem";
      return (
        <span
          style={{
            fontWeight: 900,
            color: "white",
            fontSize,
            letterSpacing: "-0.02em",
          }}
        >
          {icon.initials}
        </span>
      );
    }
    return null;
  };

  return (
    /* card-wrapper: perspective + square enforced via aspect-ratio */
    <div
      style={{
        perspective: "800px",
        aspectRatio: "1 / 1",
        pointerEvents: isFlipping ? "none" : "auto", // disable hover while animating
      }}
      data-flip-axis={flipAxis}
      data-flip-direction={flipDirection}
    >
      {/* card-inner: receives the transform string from parent */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: transitionEnabled ? "transform 300ms ease-in-out" : "none",
          transform,
        }}
      >
        {/* card-face: gradient background + inward glow */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            background: gradient,
            boxShadow: `inset 0 0 40px ${glowColor}`,
          }}
        >
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/ui/Cards/FlipCard.tsx
git commit -m "feat(ui): add FlipCard presentational 3D card component"
```

---

## Chunk 3: TechCardGrid Component

### Task 4: Create `TechCardGrid` — grid container with flip logic

**Files:**
- Create: `components/ui/Cards/TechCardGrid.tsx`

Key implementation details:
- Timer cleanup: each card's flip sequence uses a local `Set<ReturnType<typeof setTimeout>>` so mid-flight timers from a previous `cardCount` don't call `setCards` on stale indices
- Pool: module-level Fisher-Yates shuffled pool; `drawFromPool` advances index exactly once per call, checking for same-icon collision with one retry pass
- `flipAxis` and `flipDirection` are tracked in card state and passed to `FlipCard`

- [ ] **Step 1: Create `components/ui/Cards/TechCardGrid.tsx`**

```tsx
// components/ui/Cards/TechCardGrid.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { FlipCard } from "./FlipCard";
import {
  BIFROST_GRADIENTS,
  BIFROST_GLOWS,
  type TechIcon,
} from "@/data/index";
import { techStackIcons } from "@/data/tech-icons";

// ─── Fisher-Yates shuffle ───────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Module-level shared pool ───────────────────────────────────
// All cards draw from one sequence so the pool cycles smoothly.
let pool: TechIcon[] = shuffle(techStackIcons);
let poolIndex = 0;

/**
 * Draw the next icon from the shuffled pool.
 * Guarantees the returned icon is not the same as `currentName`.
 *
 * Normal path: poolIndex advances by 1.
 * Collision path: poolIndex advances by 2 (skips the colliding entry).
 * Both paths correctly handle pool wrap-around via the `>= pool.length`
 * guard + reshuffle before reading the next slot. After the collision
 * reshuffle, `poolIndex` is set to 0, the replacement is read from
 * pool[0], then poolIndex++ leaves it at 1 — the next caller correctly
 * starts from position 1 (not re-reading position 0).
 */
function drawFromPool(currentName: string): TechIcon {
  if (poolIndex >= pool.length) {
    pool = shuffle(techStackIcons);
    poolIndex = 0;
  }

  let icon = pool[poolIndex];
  poolIndex++;

  // If collision, take the next slot (wrap + reshuffle if needed)
  if (icon.name === currentName) {
    if (poolIndex >= pool.length) {
      pool = shuffle(techStackIcons);
      poolIndex = 0;
    }
    icon = pool[poolIndex]; // read replacement
    poolIndex++;            // advance past it — next caller starts here
  }

  return icon;
}

// ─── Per-card state ─────────────────────────────────────────────
type CardState = {
  icon: TechIcon;
  gradient: string;
  glowColor: string;
  transform: string;
  transitionEnabled: boolean;
  isFlipping: boolean;
  flipAxis: "X" | "Y";
  flipDirection: 1 | -1;
};

function randomGradientIndex(): number {
  return Math.floor(Math.random() * BIFROST_GRADIENTS.length);
}

function randomAxis(): "X" | "Y" {
  return Math.random() < 0.7 ? "Y" : "X";
}

function randomInterval(): number {
  return 3000 + Math.random() * 4000; // 3000–7000ms
}

function buildInitialCards(count: number): CardState[] {
  return Array.from({ length: count }, (_, i) => {
    const gIdx = (i * 3) % BIFROST_GRADIENTS.length;
    const icon = techStackIcons[i % techStackIcons.length];
    return {
      icon,
      gradient: BIFROST_GRADIENTS[gIdx],
      glowColor: BIFROST_GLOWS[gIdx],
      transform: "rotateY(0deg)",
      transitionEnabled: true,
      isFlipping: false,
      flipAxis: "Y" as const,
      flipDirection: 1 as const,
    };
  });
}

export function TechCardGrid() {
  const [cardCount, setCardCount] = useState(12);
  const [cards, setCards] = useState<CardState[]>(() => buildInitialCards(12));
  const gridRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // All active timeouts live here. On card count change, all are cleared.
  const allTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  function addTimer(t: ReturnType<typeof setTimeout>) {
    allTimers.current.add(t);
    return t;
  }

  function clearAllTimers() {
    allTimers.current.forEach(clearTimeout);
    allTimers.current.clear();
  }

  // ─── Responsive card count ──────────────────────────────────
  useEffect(() => {
    const update = () => {
      const count = window.innerWidth >= 1024 ? 24 : 12;
      setCardCount(prev => {
        if (prev !== count) {
          setCards(buildInitialCards(count));
        }
        return count;
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ─── IntersectionObserver ───────────────────────────────────
  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  // ─── Flip sequence for one card ─────────────────────────────
  const triggerFlip = useCallback((cardIndex: number) => {
    if (pausedRef.current) return;

    const axis = randomAxis();
    const phase1Transform = axis === "Y" ? "rotateY(90deg)" : "rotateX(90deg)";
    const phase2Start    = axis === "Y" ? "rotateY(-90deg)" : "rotateX(-90deg)";
    const phase2End      = axis === "Y" ? "rotateY(0deg)" : "rotateX(0deg)";

    // Phase 1: rotate card to edge-on (invisible at 90°)
    setCards(prev => {
      if (cardIndex >= prev.length) return prev;
      const next = [...prev];
      next[cardIndex] = {
        ...next[cardIndex],
        transform: phase1Transform,
        transitionEnabled: true,
        isFlipping: true,
        flipAxis: axis,
        flipDirection: 1,
      };
      return next;
    });

    // ~150ms: swap content while card is near-invisible
    addTimer(setTimeout(() => {
      setCards(prev => {
        if (cardIndex >= prev.length) return prev;
        const next = [...prev];
        const current = next[cardIndex];
        const newIcon = drawFromPool(current.icon.name);
        const gIdx = randomGradientIndex();
        // Instantly jump to opposite edge (transition OFF)
        next[cardIndex] = {
          ...current,
          icon: newIcon,
          gradient: BIFROST_GRADIENTS[gIdx],
          glowColor: BIFROST_GLOWS[gIdx],
          transform: phase2Start,
          transitionEnabled: false,
          flipAxis: axis,
          flipDirection: -1,
        };
        return next;
      });

      // One frame later: re-enable transition and sweep to 0deg
      addTimer(setTimeout(() => {
        setCards(prev => {
          if (cardIndex >= prev.length) return prev;
          const next = [...prev];
          next[cardIndex] = {
            ...next[cardIndex],
            transform: phase2End,
            transitionEnabled: true,
          };
          return next;
        });

        // After Phase 2 completes, clear isFlipping flag
        addTimer(setTimeout(() => {
          setCards(prev => {
            if (cardIndex >= prev.length) return prev;
            const next = [...prev];
            next[cardIndex] = { ...next[cardIndex], isFlipping: false };
            return next;
          });
        }, 320)); // 300ms transition + 20ms buffer
      }, 16)); // one animation frame
    }, 150));
  }, []);

  // ─── Per-card staggered intervals ───────────────────────────
  useEffect(() => {
    clearAllTimers();

    const scheduleCard = (index: number) => {
      const stagger = index * 200 + Math.random() * 800;

      addTimer(setTimeout(() => {
        triggerFlip(index);

        const scheduleNext = () => {
          addTimer(setTimeout(() => {
            triggerFlip(index);
            scheduleNext();
          }, randomInterval()));
        };
        scheduleNext();
      }, stagger));
    };

    for (let i = 0; i < cardCount; i++) {
      scheduleCard(i);
    }

    return clearAllTimers;
  }, [cardCount, triggerFlip]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-4 lg:grid-cols-8 gap-1.5 lg:gap-2 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      {cards.map((card, i) => (
        <FlipCard
          key={i}
          icon={card.icon}
          gradient={card.gradient}
          glowColor={card.glowColor}
          flipAxis={card.flipAxis}
          flipDirection={card.flipDirection}
          isFlipping={card.isFlipping}
          transform={card.transform}
          transitionEnabled={card.transitionEnabled}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/ui/Cards/TechCardGrid.tsx
git commit -m "feat(ui): add TechCardGrid with staggered flip timers and IntersectionObserver"
```

---

## Chunk 4: Wire Into Tech.tsx

### Task 5: Remove TechMarquee and mount TechCardGrid in `Tech.tsx`

**Files:**
- Modify: `components/Tech.tsx`

- [ ] **Step 1: Replace imports at top of `Tech.tsx`**

Remove the entire old import block and replace with:

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
// NOTE: `useAnimation` is removed — it was only used by the deleted RandomMotionIcon.
import { useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import {
  Zap,
  Globe,
  Shield,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { TechCardGrid } from "@/components/ui/Cards/TechCardGrid";
```

> **Why these lucide imports:** `Zap`, `Globe`, `Shield`, `Users`, `TrendingUp`, `Award` are used in the feature cards grid below. All other lucide imports (`Calendar`, `Cloud`, `Mail`, `Video`, `Database`, `Server`, `Code`, `Smartphone`, `Monitor`, `Palette`, `Layers`, `Cpu`, `HardDrive`, `Wifi`, `BarChart3`, `CreditCard`) were only used in `techIcons` or `RandomMotionIcon` and are removed.

- [ ] **Step 2: Delete `techIcons`, `RandomMotionIcon`, and `TechMarquee` from `Tech.tsx`**

Delete the following three blocks entirely:
1. `const techIcons = { ... }` — the lucide-react icon mapping object
2. `function RandomMotionIcon(...)` — including its full function body
3. `function TechMarquee()` — including its full function body

Only `Counter`, `useSubscribers`, and `export default function Tech()` remain.

- [ ] **Step 3: Replace the TechMarquee JSX block with TechCardGrid**

Find this exact block in the JSX inside `Tech()`:

```tsx
{/* Tech Marquee */}
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1, delay: 0.5 }}
  viewport={{ once: true }}
  className="mb-20"
>
  <h3 className="text-3xl font-bold text-white text-center mb-8">
    Our Tech Arsenal
  </h3>
  <TechMarquee />
</motion.div>
```

Replace it with (both the `<h3>` tag AND `<TechMarquee />` are removed):

```tsx
{/* Tech Flip Grid */}
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1, delay: 0.3 }}
  viewport={{ once: true }}
  className="mb-20"
>
  <TechCardGrid />
</motion.div>
```

- [ ] **Step 4: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Step 5: Visual check in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/#tech`. Verify:
- [ ] Desktop (≥1024px): 8×3 grid visible, cards are square, ~140px wide
- [ ] Cards independently flip with staggered timing (not all at once)
- [ ] Each flip reveals a different icon + new Bifrost gradient color
- [ ] Edge fade visible (left/right edges fade to background)
- [ ] Resize to mobile (<1024px): 4×3 grid (12 cards), ~80px wide
- [ ] Stats counters, feature cards, section h2, and `id="tech"` all unchanged
- [ ] "Our Tech Arsenal" h3 heading is gone
- [ ] No console errors

- [ ] **Step 6: Commit**

```bash
git add components/Tech.tsx
git commit -m "feat(tech): replace TechMarquee with TechCardGrid 3D flip grid

- Remove techIcons const, RandomMotionIcon, TechMarquee, 'Our Tech Arsenal' h3
- Mount TechCardGrid in motion.div fade-in wrapper
- Remove unused lucide-react and useAnimation imports"
```

---

## Done

After all 5 tasks are committed and the visual check passes, the Tech.tsx flip grid is complete.

**Next steps (per session plan):**
1. Full user workflow test: pricing → Stripe → checkout → login (auth) → dashboard
2. Dashboard audit (background studio + consulting AI workflow)
3. Pre-launch audit (Cloudflare, Sentry decision)
4. Git push, final build, deploy to Vercel/Hostinger
