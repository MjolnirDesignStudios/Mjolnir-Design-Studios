// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!); // Add this env var
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      // Fulfill: e.g., email user, update DB with session.metadata.mjolnir_tier
      if (session.metadata && session.metadata.mjolnir_tier) {
        console.log("Payment succeeded for tier:", session.metadata.mjolnir_tier);
      } else {
        console.log("Payment succeeded, but no tier information found in metadata.");
      }
    }
    // Add other events as needed
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}