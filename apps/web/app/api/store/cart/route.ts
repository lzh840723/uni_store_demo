import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';

export async function POST(request: NextRequest) {
  const commerceEnabled = await ensureFeatureEnabled(request, 'commerce');
  if (!commerceEnabled) {
    return NextResponse.json({ message: 'Commerce feature disabled' }, { status: 404 });
  }

  const cart = await prisma.cart.create({ data: {} });
  return NextResponse.json({ cartId: cart.id, items: [], totalCents: cart.totalCents }, { status: 201 });
}
