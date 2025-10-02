import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  const commerceEnabled = await ensureFeatureEnabled(request, 'commerce');
  if (!commerceEnabled) {
    return NextResponse.json({ message: 'Commerce feature disabled' }, { status: 404 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: { include: { product: true } }, customer: true }
  });

  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(order);
}
