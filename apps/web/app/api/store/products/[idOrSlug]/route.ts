import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';

export async function GET(_request: NextRequest, { params }: { params: { idOrSlug: string } }) {
  const commerceEnabled = await ensureFeatureEnabled(_request, 'commerce');
  if (!commerceEnabled) {
    return NextResponse.json({ message: 'Commerce feature disabled' }, { status: 404 });
  }

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: params.idOrSlug }, { slug: params.idOrSlug }]
    }
  });

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
