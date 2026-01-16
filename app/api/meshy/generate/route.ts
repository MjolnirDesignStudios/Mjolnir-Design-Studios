// app/api/meshy/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
  }

  // Use your server-only env var
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // Forward to Meshy (preview task example)
  const res = await fetch('https://api.meshy.ai/openapi/v2/text-to-3d', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'preview',
      prompt,
      art_style: 'realistic',
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}