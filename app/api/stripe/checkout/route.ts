import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// ── Server-side price ID map — NEVER trust price IDs from the client ──────────
// All price IDs must live in environment variables; these are the fallbacks from
// the Pricing.tsx component for local dev. In production, set the corresponding
// STRIPE_PRICE_* env vars in Vercel.
const PRICE_MAP: Record<string, string> = {
  base_monthly:  process.env.STRIPE_PRICE_BASE_MONTHLY  || 'price_1T7K1dFxkFUD7EnZr3zjSJbR',
  base_annual:   process.env.STRIPE_PRICE_BASE_ANNUAL   || 'price_1T7K3UFxkFUD7EnZCyYlsSMW',
  pro_monthly:   process.env.STRIPE_PRICE_PRO_MONTHLY   || 'price_1T7K7hFxkFUD7EnZWMC8HCxA',
  pro_annual:    process.env.STRIPE_PRICE_PRO_ANNUAL    || 'price_1T7K8KFxkFUD7EnZeweUODVB',
  elite_monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY || 'price_1T8rLOFxkFUD7EnZ6YqWV43v',
  elite_annual:  process.env.STRIPE_PRICE_ELITE_ANNUAL  || 'price_1T8rLpFxkFUD7EnZbzpBrARl',
  workshop_live: process.env.STRIPE_WORKSHOP_LIVE_PRICE_ID!,
};

const SUBSCRIPTION_PRODUCTS = new Set([
  'base_monthly', 'base_annual', 'pro_monthly', 'pro_annual', 'elite_monthly', 'elite_annual',
]);

// Zod schema — only accept a product slug, never a raw priceId
const CheckoutSchema = z.object({
  product: z.enum([
    'base_monthly',
    'base_annual',
    'pro_monthly',
    'pro_annual',
    'elite_monthly',
    'elite_annual',
    'workshop_live',
  ]),
});

export async function POST(request: NextRequest) {
  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid product', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { product } = parsed.data;

  const priceId = PRICE_MAP[product];
  if (!priceId) {
    console.error(`[stripe/checkout] Missing price ID for product: ${product}`);
    return NextResponse.json({ error: 'Product not configured' }, { status: 500 });
  }

  const isSubscription = SUBSCRIPTION_PRODUCTS.has(product);
  const successUrl = product === 'workshop_live'
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/intake`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/success`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      allow_promotion_codes: true,
      metadata: { product },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[stripe/checkout] Stripe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
