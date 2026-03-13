# Tech Stack Flip Grid — Design Spec

**Date:** 2026-03-12
**Status:** Approved by user
**Component:** `components/Tech.tsx` (rebuilt in-place)

---

## Goal

Replace the existing `TechMarquee` scrolling component in `Tech.tsx` with a Coinbase-inspired 3D flip card grid that displays tech stack icons. Cards flip independently on staggered timers, revealing a new icon and Bifrost gradient color on each flip. The outer edges fade to the page background. Existing metrics counters and feature cards below the grid are preserved unchanged.

---

## Architecture

```
components/Tech.tsx
├── TechCardGrid        — grid layout + stagger timer coordination + edge-fade mask
│   └── FlipCard        — single 3D CSS preserve-3d card (pure presentational)
├── Counter             — unchanged (animated number counter)
└── feature cards       — unchanged (Lightning Performance, Enterprise Security, etc.)

data/index.ts
└── techStackIcons[]    — TechIcon[] array (new export)
    └── TechIcon type   — { name, svgPath?, reactIcon?, initials? }
```

### File Responsibilities

**`FlipCard`** — receives `icon: TechIcon`, `gradient: string`, `flipAxis: 'X' | 'Y'`, `isFlipping: boolean`, `flipDirection: 1 | -1` as props. Renders nothing but the card HTML + CSS 3D transforms. Zero logic.

**`TechCardGrid`** — owns all state and timers. Initialises 24 card slots (desktop `lg+`) / 12 card slots (mobile default). Runs `setInterval` per card with randomised delay and interval. On each tick: picks next icon from shuffled pool, picks random gradient, picks random axis, triggers flip sequence.

**`data/index.ts`** — adds `techStackIcons` export alongside existing exports. No changes to existing exports.

---

## Grid Dimensions

| Viewport | Columns | Rows | Cards |
|----------|---------|------|-------|
| Desktop (`lg+`, 1024px+) | 8 | 3 | 24 |
| Tablet (`md`, 768px–1023px) | 4 | 3 | 12 |
| Mobile (default, <768px) | 4 | 3 | 12 |

> **Note:** `md` and mobile share the same 4×3 layout. The grid switches from 4 columns to 8 columns only at the `lg` breakpoint (1024px). No intermediate layout exists.

Cards are square, enforced via `aspect-ratio: 1 / 1` on the `.card-wrapper` element. Desktop card size: ~140px wide (grid fills container with `gap-2`). Mobile card size: ~80px wide. Gap between cards: `gap-2` (8px) on desktop, `gap-1.5` (6px) on mobile.

The grid container is `overflow: hidden` with edge-fade applied via CSS `mask-image`. Cards do **not** bleed beyond the section on mobile — the 4×3 grid fits within the viewport.

---

## Animation System

### Flip Sequence (per card)

The flip uses a single-face card (no back face). The card "disappears" at the midpoint of rotation, content swaps while invisible, then "reappears" coming from the opposite direction.

**Y-axis flip:**
1. `isFlipping = true` → CSS `transform: rotateY(90deg)` over **300ms ease-in-out** (card rotates to edge-on, invisible)
2. At ~150ms (approximate midpoint — card is edge-on) → swap `icon` and `gradient` state via `setTimeout(fn, 150)`
3. Instantly set `transform: rotateY(-90deg)` (no transition — card stays invisible at opposite edge)
4. Re-enable transition → animate to `rotateY(0deg)` over **300ms ease-in-out** (new face sweeps in)
5. `isFlipping = false`, timer resets with new random interval

**X-axis flip:**
1. `isFlipping = true` → CSS `transform: rotateX(90deg)` over **300ms ease-in-out**
2. At ~150ms → swap `icon` and `gradient` state via `setTimeout(fn, 150)`
3. Instantly set `transform: rotateX(-90deg)` (no transition)
4. Re-enable transition → animate to `rotateX(0deg)` over **300ms ease-in-out**
5. `isFlipping = false`, timer resets

> **Implementation note:** The 150ms swap `setTimeout` fires at the approximate visual midpoint of the 300ms Phase 1 animation. It does not guarantee exact frame-perfect invisibility — CSS `ease-in-out` means the card is not perfectly edge-on at 150ms, but is close enough to be imperceptible. This is intentional and matches the Coinbase reference.

Implementation uses two CSS transitions chained via `setTimeout`:
- Phase 1: `rotateY/X(90deg)` — 300ms, transition enabled
- Swap at 150ms via `setTimeout`
- Phase 2: set `rotateY/X(-90deg)` instantly (transition disabled via `transition: none`), then re-enable transition and animate to `rotateY/X(0deg)` — 300ms

### Timer Configuration

| Parameter | Value |
|-----------|-------|
| Initial stagger delay | `cardIndex * 200ms + Math.random() * 800ms` |
| Min interval between flips | 3000ms |
| Max interval between flips | 7000ms |
| Flip axis distribution | 70% `rotateY`, 30% `rotateX` |
| Flip speed | 300ms per phase (600ms total) |

### Icon Pool Management

**Desktop (24 cards):** Pool contains all `techStackIcons` entries (24+ icons). Shuffled via Fisher-Yates on mount. Cards draw sequentially from the shuffled pool. Pool re-shuffles when exhausted.

**Mobile (12 cards):** Same pool and same logic — 12 cards draw from the same Fisher-Yates shuffled pool. The reduced card count means the pool cycles faster, which is acceptable.

**Rule:** No card shows the same icon twice in a row — each flip always draws the *next* entry from the pool, never re-using the card's current icon.

---

## CSS 3D Card Structure

```html
<!-- .card-wrapper: perspective(800px), aspect-ratio: 1/1 -->
<div class="card-wrapper">
  <!-- .card-inner: transform-style: preserve-3d, transition: transform 300ms -->
  <div class="card-inner">
    <!-- .card-face: background: gradient, rounded corners -->
    <div class="card-face">
      <!-- Option 1: SVG file -->
      <img src={icon.svgPath} width={48} height={48} style="filter: brightness(0) invert(1); object-fit: contain" />
      <!-- Option 2: react-icon component at 48px, color white -->
      <!-- Option 3: text initials badge, font-weight 900, color white -->
    </div>
  </div>
</div>
```

### Key CSS Properties

```css
.card-wrapper {
  perspective: 800px;
  aspect-ratio: 1 / 1;  /* enforces square regardless of grid cell size */
}
.card-inner {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 300ms ease-in-out;
}
.card-face {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  /* backface-visibility not needed — single-face card */
}
```

> **Single-face clarification:** This component uses one face only (no hidden back face). The flip animation rotates the card to invisible (90°), swaps content, then rotates back from the opposite side (−90° → 0°). `backface-visibility` is not required.

---

## Bifrost Gradient Palette

Six gradients, randomly assigned per flip:

| Name | CSS Value |
|------|-----------|
| Electric Purple | `linear-gradient(135deg, #7C3AED, #4F46E5)` |
| Electric Blue | `linear-gradient(135deg, #0EA5E9, #2563EB)` |
| Electric Green | `linear-gradient(135deg, #10B981, #16A34A)` |
| Electric Gold | `linear-gradient(135deg, #EAB308, #D4AF37)` |
| Electric Orange | `linear-gradient(135deg, #F97316, #EA580C)` |
| Electric Red | `linear-gradient(135deg, #EF4444, #DC2626)` |

Card inner glow: `box-shadow: inset 0 0 40px <gradient-start-color>30` — e.g. for Electric Purple: `inset 0 0 40px #7C3AED30`. Creates the Coinbase-style inward glow.

Card background base: `#0a0a0a` (matches page background). Gradient applied as `background` property (gradient string directly, not `background-image`).

The six gradient CSS strings are exported as a `BIFROST_GRADIENTS` constant array in `data/index.ts` alongside `techStackIcons`.

---

## Edge Fade

Applied to the `TechCardGrid` wrapper div:

```css
mask-image: linear-gradient(
  to right,
  transparent 0%,
  black 8%,
  black 92%,
  transparent 100%
);
-webkit-mask-image: linear-gradient(
  to right,
  transparent 0%,
  black 8%,
  black 92%,
  transparent 100%
);
```

No additional overlay divs required. Applied as inline `style` prop in Tailwind/React (not a global CSS class).

---

## Icon System

### TechIcon Type

```ts
export type TechIcon = {
  name: string;
  svgPath?: string;                                    // "/Icons/Technologies/react.svg"
  reactIcon?: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  initials?: string;                                   // "EL" — 2-3 char fallback badge
};
```

The `reactIcon` field accepts any react-icons component (e.g. `SiReact` from `react-icons/si`), typed as `React.ComponentType` with common icon props. This matches the actual react-icons type signature.

### Resolution Priority

1. `svgPath` — rendered via standard `<img>` tag (NOT `next/image`) with `style={{ filter: 'brightness(0) invert(1)', objectFit: 'contain', width: 48, height: 48 }}`
2. `reactIcon` — rendered as `<Icon size={48} color="white" />` (react-icons native props)
3. `initials` — `<span>` with `font-weight: 900`, `color: white`, `font-size` scaled to fit card (approx 1.5rem for 2-char, 1.1rem for 3-char)

> **Why `<img>` not `next/image`:** react-icon components and SVG paths both render inline/as standard elements. Using `next/image` for the SVG case would require `fill` layout + positioned wrapper, adding complexity for no benefit on small icons. Standard `<img>` with explicit `width={48} height={48}` is correct here.

### SVG Normalisation

All SVGs displayed at exactly `48×48` CSS pixels via explicit `width` and `height` props on the `<img>` tag. Source file dimensions are irrelevant. `objectFit: 'contain'` applied.

### Icon Source Guidelines

- Download custom brand SVGs from official media kits or [simpleicons.org](https://simpleicons.org)
- Drop into `/public/Icons/Technologies/<name>.svg`
- Add entry to `techStackIcons[]` in `data/index.ts` with `svgPath`
- No code changes required to pick up new icons — pool auto-includes all entries

### Initial Icon Pool (~24 entries at launch)

Sourced from existing `/Icons/Technologies/` + react-icons/si:

`React, Next.js, TypeScript, Tailwind CSS, GSAP, Three.js, Framer Motion, Supabase, Stripe, Vercel, Docker, Figma, GitHub, Python, JavaScript, HTML5, CSS3, Blender, HubSpot, Replit, Node.js, Cloudflare, PostgreSQL, Anthropic (Claude)`

Placeholders using initials until SVGs sourced: `ElevenLabs (EL), Grok (GK), Meshy (MS), Calendly (CA), Remotion (RE), OdinAI (OD)`

---

## Responsive Behaviour

| Breakpoint | Columns | Rows | Card Size | Gap | Total Cards |
|------------|---------|------|-----------|-----|-------------|
| Default (mobile, <768px) | 4 | 3 | ~80px | 6px (`gap-1.5`) | 12 |
| `md` (768px–1023px) | 4 | 3 | ~80px | 6px (`gap-1.5`) | 12 |
| `lg` (1024px+) | 8 | 3 | ~140px | 8px (`gap-2`) | 24 |

Grid uses CSS Grid: `grid-template-columns: repeat(4, 1fr)` on default/md, `lg:grid-cols-8` on desktop.

The card count switches from 12 to 24 at `lg`. `TechCardGrid` reads a `useWindowSize` or `useEffect`+`window.innerWidth` check to initialize the correct number of card slots. Cards are added/removed reactively on resize.

---

## Section Header Changes

The existing `<h3 className="text-3xl font-bold text-white text-center mb-8">Our Tech Arsenal</h3>` heading (currently rendered above `TechMarquee`) is **removed** along with `TechMarquee`. The flip grid replaces both. No new `<h3>` is added above the grid — the section `<h2>` ("Asgardian Tech") is sufficient.

---

## What Is Preserved From Existing Tech.tsx

- `Counter` component — unchanged
- `useSubscribers` hook — unchanged
- Stats grid (4 metric cards with colored borders/glows) — unchanged
- Feature cards grid (6 cards) — unchanged
- Section header `<h2>` ("Asgardian Tech") — unchanged
- Section `id="tech"` — unchanged

**Removed:** `TechMarquee`, `RandomMotionIcon`, and the `<h3>Our Tech Arsenal</h3>` heading above the marquee.

---

## Performance Notes

- All `setInterval` timers cleaned up on component unmount via `useEffect` return
- `IntersectionObserver` pauses all flip timers when section is off-screen (battery/CPU friendly)
- Images loaded with standard `<img>` tag (48×48px icons — no need for Next.js image optimization at this size)
- No new npm dependencies required
- `techIcons` object at top of `Tech.tsx` (lucide-react mapping) is removed — replaced by `techStackIcons` from `data/index.ts`
