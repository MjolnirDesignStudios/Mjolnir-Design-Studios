import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const HubSpotIntakeSchema = z.object({
  name:            z.string().min(1).max(200),
  email:           z.string().email().max(254),
  phone:           z.string().max(30).optional().or(z.literal('')),
  businessName:    z.string().max(200).optional().or(z.literal('')),
  industry:        z.string().max(100).optional().or(z.literal('')),
  currentWebsite:  z.string().url('Invalid URL').max(500).optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  // Parse JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate
  const parsed = HubSpotIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const formData = parsed.data;

  const hubspotApiKey = process.env.HUBSPOT_API_KEY;
  const portalId     = process.env.HUBSPOT_PORTAL_ID;
  const formId       = process.env.HUBSPOT_FORM_ID;

  if (!hubspotApiKey || !portalId || !formId) {
    console.warn('[hubspot/intake] HubSpot credentials not configured');
    return NextResponse.json({
      success: false,
      message: 'HubSpot integration not configured',
    });
  }

  const hubspotData = {
    fields: [
      { name: 'firstname', value: formData.name?.split(' ')[0] || '' },
      { name: 'lastname',  value: formData.name?.split(' ').slice(1).join(' ') || '' },
      { name: 'email',     value: formData.email },
      { name: 'phone',     value: formData.phone || '' },
      { name: 'company',   value: formData.businessName || '' },
      { name: 'industry',  value: formData.industry || '' },
      { name: 'website',   value: formData.currentWebsite || '' },
      { name: 'lifecyclestage', value: 'lead' },
    ],
    context: {
      pageUri:  'mjolnir-forge-workshop-intake',
      pageName: 'Mjolnir Forge Workshop Intake Form',
    },
  };

  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(hubspotData),
      }
    );

    if (!response.ok) {
      // Log full error server-side; return generic message to client
      const errorText = await response.text();
      console.error('[hubspot/intake] HubSpot API error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to submit to CRM' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Successfully submitted to CRM' });
  } catch (error) {
    console.error('[hubspot/intake] Unexpected error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
