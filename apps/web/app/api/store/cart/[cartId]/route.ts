import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';

export async function GET(request: NextRequest, { params }: { params: { cartId: string } }) {
  const commerceEnabled = await ensureFeatureEnabled(request, 'commerce');
  if (!commerceEnabled) {
    return NextResponse.json({ message: 'Commerce feature disabled' }, { status: 404 });
  }

  const cart = await prisma.cart.findUnique({
    where: { id: params.cartId },
    include: { items: { include: { product: true } } }
  });

  if (!cart) {
    return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
  }

  return NextResponse.json(cart);
}
