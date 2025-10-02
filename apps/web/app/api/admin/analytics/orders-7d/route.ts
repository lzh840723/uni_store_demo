import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';
import { isRole } from '@/server/roles';
import { jsonError } from '@/server/http';

export async function GET(request: NextRequest) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'analytics'))) {
    return jsonError('Analytics feature disabled', 404);
  }

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start } }
  });

  type OrderRecord = (typeof orders)[number];

  const labels: string[] = [];
  const count: number[] = [];
  const gmv: number[] = [];

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const dayOrders = orders.filter((order: OrderRecord) => order.createdAt >= day && order.createdAt < nextDay);
    labels.push(day.toISOString().slice(0, 10));
    count.push(dayOrders.length);
    gmv.push(dayOrders.reduce((sum: number, order: OrderRecord) => sum + order.totalCents, 0));
  }

  return NextResponse.json({ labels, data: { count, gmv } });
}
