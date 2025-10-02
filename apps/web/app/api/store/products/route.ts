import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';

const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0)
});

export async function GET(request: NextRequest) {
  const commerceEnabled = await ensureFeatureEnabled(request, 'commerce');
  if (!commerceEnabled) {
    return NextResponse.json({ message: 'Commerce feature disabled' }, { status: 404 });
  }

  const limitParam = request.nextUrl.searchParams.get('limit') ?? undefined;
  const offsetParam = request.nextUrl.searchParams.get('offset') ?? undefined;

  const params = paginationSchema.parse({
    limit: limitParam,
    offset: offsetParam
  });

  const [items, count] = await Promise.all([
    prisma.product.findMany({
      take: params.limit,
      skip: params.offset,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count()
  ]);

  return NextResponse.json({ items, count, limit: params.limit, offset: params.offset });
}
