# Mjolnir Design Studios — Friday MVP Design Spec

**Date:** 2026-03-10
**Author:** Claude (Session 4 Brainstorming)
**Launch Target:** Friday, March 13, 2026
**Strategy:** Option A — Full Parallel Blitz (4 independent tracks, simultaneous)
**Status:** AWAITING USER APPROVAL

---

## 1. Scope

### In Scope (Friday MVP)
Everything a client needs to discover, pay, book, and be onboarded:

1. **Payments & Booking (P0)** — Stripe checkout with discount codes, Calendly booking with QR codes, Resend confirmation emails for booking + payment
2. **Auth, Intake & OdinAI (P1)** — Supabase auth, intake form redesign with business data mapping, OdinAI consulting blueprint generation API
3. **Asgardian Command Center (P2)** — Admin dashboard with real Stripe + Supabase + HubSpot + Calendly data
4. **MjolnirUI Blocks & Products (P3)** — Tier-gated blocks dashboard, OdinAI chatbox UI, shader studio polish

### Out of Scope (Post-Launch)
- OdinAI avatar (Cortana-style, ElevenLabs TTS/STT)
- Remotion product videos for social media
- Resend automated newsletter (templates will be built, automation deferred)
- Gantt / project tracking system
- Mjolnir3D hammer model
- Webinar product (Calendly + Zoom)

### Also Installing (Friday)
- `remotion` + `@remotion/player` — installed but not yet used
- Docker — NOT needed; Vercel handles containerization

---

## 2. Architecture

### Stack (unchanged)
Next.js 15.5.12 + React 19 + TypeScript + Tailwind v3 + Supabase + Stripe + Anthropic Claude API + Resend + HubSpot + Calendly

### Dev Server Fix
- `package.json` `dev` script changed to `next dev --turbopack`
- Result: startup time 363s → 2.9s (124× faster)

### Full Data Flow
```
User visits → Supabase Auth (GitHub/Twitter OAuth)
           → Intake Form → Supabase workshop_intake + HubSpot CRM
           → Stripe Checkout (with optional discount code)
           → Stripe Webhook → Supabase profiles (subscription tier)
                           → Resend subscription confirmation email
           → Calendly Booking (QR code or direct link)
           → Calendly Webhook (HMAC-SHA256) → Supabase workshop_signups
                                            → HubSpot CRM update
                                            → Resend booking confirmation email
           → OdinAI Blueprint generation (POST /api/odin/blueprint)
           → Blueprint stored in profiles.odin_blueprint (JSONB)
```

---

## 3. API Routes

### Existing (Do Not Touch)
| Route | Status |
|-------|--------|
| `POST /api/stripe/checkout` | ✅ Working |
| `POST /api/stripe/checkout/webhook` | ✅ Working |
| `POST /api/intake` | ✅ Working |
| `POST /api/hubspot/intake` | ✅ Working |

### Track 1 — Payments & Booking (P0)
| Route | Description |
|-------|-------------|
| `POST /api/stripe/discount` | Validate Stripe coupon code, return discount details |
| `POST /api/calendly/webhook` | HMAC-SHA256 verified, writes to Supabase + HubSpot, triggers Resend |
| `POST /api/resend/booking` | Client booking confirmation + admin notification |
| `POST /api/resend/subscription` | Triggered by Stripe webhook after successful payment |

### Track 2 — Auth, Intake & OdinAI (P1)
| Route | Description |
|-------|-------------|
| `POST /api/odin/chat` | Claude API chat endpoint — model by tier, token tracking |
| `POST /api/odin/blueprint` | Intake → 5-prompt framework → consulting blueprint JSON |
| `GET /api/profile/usage` | Current user token usage + tier info |

### Track 3 — Admin (P2, service role only)
| Route | Description |
|-------|-------------|
| `GET /api/admin/dashboard` | Total users, MRR, active subscriptions — real Stripe + Supabase |
| `GET /api/admin/payments` | Stripe payment_intents last 90 days |
| `GET /api/admin/contacts` | HubSpot CRM contacts (recent 50) |
| `GET /api/admin/bookings` | Calendly bookings from Supabase workshop_signups |

---

## 4. Database Changes

### New Columns on `profiles` table
```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS odin_blueprint     JSONB,
  ADD COLUMN IF NOT EXISTS odin_tokens_used   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_tier  TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
```

### Ensure `workshop_signups` schema
```sql
CREATE TABLE IF NOT EXISTS public.workshop_signups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles(id),
  email           TEXT NOT NULL,
  event_name      TEXT,
  event_start     TIMESTAMPTZ,
  calendly_uri    TEXT UNIQUE,
  hubspot_contact_id TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. OdinAI Blueprint Engine

### Intake Data Captured
- Business name, industry, stage (startup / growth / established)
- Revenue range, team size
- Primary pain points (multi-select: operations, marketing, tech, finance, etc.)
- Goals for next 90 days
- Current tools / tech stack
- Budget range for services
- Preferred service tier

### Prompt Framework (5 sequential prompts, chained)
1. **Business Context Prompt** — Frames the company for Claude (industry, stage, size, goals)
2. **Pain Point Analysis Prompt** — Deep-dives each pain point, identifies root causes vs symptoms
3. **Opportunity Mapping Prompt** — Maps 3 highest-ROI opportunities given constraints + budget
4. **Roadmap Generation Prompt** — Creates phased 90-day plan with milestones and owners
5. **Service Recommendation Prompt** — Recommends specific MDS service package + tier with full justification

### Blueprint Output Format (JSONB)
```json
{
  "generated_at": "ISO timestamp",
  "executive_summary": "...",
  "priority_opportunities": [...],
  "recommended_package": "Pro | Elite | Custom",
  "roadmap": { "phase1": {...}, "phase2": {...}, "phase3": {...} },
  "kpis": [...],
  "tech_recommendations": [...],
  "next_step": "Book your strategy consultation"
}
```

---

## 6. Admin Dashboard (Asgardian Command Center)

### Layout
- Fixed top navbar: logo + page title + notifications + user avatar menu
- Collapsible sidebar: icon-only at 72px, expands to 280px on hover (Framer Motion)
- Main content area: scrollable

### Views
- **Overview**: 2 wide stat cards (MRR, Total Revenue) + 4 narrow (Users, Subscribers, Bookings, Leads) + AreaChart (revenue/expenses) + PieChart (payment status) + recent payments table
- **Revenue**: Full payment history table, search + filter by status
- **Clients**: HubSpot contacts table with pipeline stage
- **Bookings**: Workshop signups from Supabase

### CSS Variables (preserved from code block)
```css
--mjolnir-gold: #D4AF37;
--bg-primary: #0A0A0A;
--bg-elevated: #131313;
--border-color: rgba(212,175,55,0.12);
--text-primary: rgba(255,255,255,0.9);
--text-secondary: rgba(255,255,255,0.5);
```

### Access Control
- Route protected by `is_admin = TRUE` on `profiles` table
- API routes use `supabaseAdmin` (service role) — not user-scoped client

---

## 7. Email Templates (Resend)

Three email types (already scaffolded in `lib/email.ts`):
1. **Subscription Confirmation** — tier name, features, login link
2. **Workshop/Booking Confirmation** — date, time, Calendly link, prep instructions
3. **Admin Notification** — new signup summary to `contact@mjolnirdesignstudios.com`

---

## 8. Build Strategy

### Parallel Tracks (simultaneous)
| Track | Owner | Key Files |
|-------|-------|-----------|
| P0: Payments | Subagent | `app/api/stripe/discount/`, `app/api/calendly/webhook/`, `app/api/resend/`, `components/Pricing.tsx`, `app/(public)/workshop/` |
| P1: Auth+OdinAI | Subagent | `app/api/odin/`, `app/(public)/intake/`, `lib/supabase/`, `lib/email.ts` |
| P2: Admin | Subagent | `app/(protected)/admin/`, `app/api/admin/` |
| P3: UI/Blocks | Subagent | `app/(protected)/blocks/`, `components/ai/`, `app/(protected)/profile/` |

### Merge Order
1. Database migration first (affects all tracks)
2. Tracks P0 + P1 + P2 simultaneously
3. Track P3 last (depends on auth + profile from P1)
4. Integration test the full user journey end-to-end

---

## 9. Error Handling

- **Stripe webhook**: return 200 fast, process async; log failures to Supabase `webhook_logs`
- **Calendly webhook**: verify HMAC first, 401 if invalid, then idempotent upsert
- **OdinAI**: graceful degradation if Claude API fails (queue the blueprint, notify admin)
- **Resend**: fire-and-forget with try/catch; don't fail payment on email failure
- **Admin routes**: 401 if not authenticated, 403 if not admin, 500 with sanitized message

---

## 10. Verification Plan

Before declaring MVP done:
- [ ] User can sign in with GitHub OAuth, profile created in Supabase
- [ ] User can complete Stripe checkout for Base/Pro/Elite subscription
- [ ] Discount code reduces checkout price
- [ ] Stripe webhook updates `profiles.subscription_tier`
- [ ] Subscription confirmation email received via Resend
- [ ] User can book workshop via Calendly QR code
- [ ] Calendly webhook creates row in `workshop_signups`
- [ ] Booking confirmation email received
- [ ] Intake form saves to Supabase + HubSpot
- [ ] OdinAI blueprint generates and saves to `profiles.odin_blueprint`
- [ ] Admin dashboard shows real data at `/admin`
- [ ] All 4 admin API routes return real data
- [ ] `tsc --noEmit` passes with zero errors

---

## 11. Remotion + Docker Notes

**Remotion:** Install `remotion` + `@remotion/player` now for future video work. No implementation needed Friday.

**Docker:** Not needed. Vercel deployment handles containerization automatically. No `Dockerfile` required for this project. If needed later (e.g., self-hosted), a `Dockerfile` can be added post-launch.
