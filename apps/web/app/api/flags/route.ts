import { NextRequest, NextResponse } from 'next/server';
import { resolveFlags } from '@/server/flags';

export async function GET(request: NextRequest) {
  const flags = await resolveFlags(request);
  return NextResponse.json(flags, { headers: { 'Cache-Control': 'no-store' } });
}
