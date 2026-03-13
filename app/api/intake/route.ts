import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ── In-memory rate limiter (per IP, resets on server restart) ─────────────────
// For production, replace with Upstash Redis rate limiting.
const rateStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;           // max submissions per window
const RATE_WINDOW_MS = 60_000;  // 1-minute window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true; // allowed
  }
  if (entry.count >= RATE_LIMIT) return false; // blocked
  entry.count++;
  return true; // allowed
}

const IntakeSchema = z.object({
  name:           z.string().min(1).max(200),
  dob:            z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  address:        z.string().min(1).max(500),
  email:          z.string().email().max(254),
  phone:          z.string().min(7).max(30).regex(/^[+\d\s\-().]+$/, 'Invalid phone format'),
  businessName:   z.string().min(1).max(200),
  industry:       z.enum([
    'consulting', 'education', 'finance', 'healthcare',
    'professional services', 'real estate', 'technology', 'other',
  ]),
  currentWebsite: z.string().url('Invalid URL').max(500).optional().or(z.literal('')),
  goals:          z.string().min(1).max(2000),
  eventId:        z.string().max(200).optional().nullable(),
});

export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait before trying again.' },
      { status: 429 }
    );
  }

  // Parse JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate
  const parsed = IntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const {
    name, dob, address, email, phone,
    businessName, industry, currentWebsite, goals, eventId,
  } = parsed.data;

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('workshop_intake')
      .insert({
        name,
        dob,
        address,
        email,
        phone,
        business_name: businessName,
        industry,
        current_website: currentWebsite || null,
        goals,
        event_id: eventId || null,
        submitted_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[intake] Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Intake form submitted successfully',
      data,
    });
  } catch (error) {
    console.error('[intake] Unexpected error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
