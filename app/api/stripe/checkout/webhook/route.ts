import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!endpointSecret) {
  console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set — webhook verification will fail');
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  if (!endpointSecret) {
    console.error('[stripe/webhook] Cannot verify webhook — STRIPE_WEBHOOK_SECRET missing');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[stripe/webhook] Signature verification failed:', message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Handle successful payment
        if (session.payment_status === 'paid') {
          // Use supabaseAdmin (service role) to bypass RLS in webhook context
          if (session.metadata?.product === 'workshop_live') {
            // Workshop payment — log for now; extend to update workshop_signups
            console.log('[stripe/webhook] Workshop payment completed:', session.id);
          } else if (session.metadata?.product) {
            // Subscription payment — update profiles tier
            const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
            if (customerId) {
              const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ stripe_customer_id: customerId, subscription_tier: session.metadata.product })
                .eq('email', session.customer_email || '');
              if (updateError) {
                console.error('[stripe/webhook] Profile update failed:', updateError.message);
              }
            }
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        // Handle recurring subscription payments
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Subscription payment succeeded:', invoice.id);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Handle subscription lifecycle events
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription event:', event.type, subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }
}