// app/api/stripe/checkout/route.ts — FINAL, SAFE, DEBUG-FRIENDLY
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, mode } = await req.json();

    if (!priceId || !mode) {
      return NextResponse.json(
        { error: "Missing priceId or mode" },
        { status: 400 }
      );
    }

    if (!["subscription", "payment"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Must be 'subscription' or 'payment'" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode as "subscription" | "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        mjolnir_tier: priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      raw: error.raw,
    });

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.message,
        code: error.code || "unknown",
      },
      { status: 500 }
    );
  }
}