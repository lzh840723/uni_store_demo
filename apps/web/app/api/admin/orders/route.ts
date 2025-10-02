import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';
import { isRole } from '@/server/roles';
import { jsonError } from '@/server/http';

export async function GET(request: NextRequest) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'commerce'))) {
    return jsonError('Commerce feature disabled', 404);
  }

  const fromParam = request.nextUrl.searchParams.get('from');
  const fromDate = fromParam ? new Date(fromParam) : undefined;

  const orders = await prisma.order.findMany({
    where: fromDate ? { createdAt: { gte: fromDate } } : undefined,
    include: { items: true, customer: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(orders);
}
