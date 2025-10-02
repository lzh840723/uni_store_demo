import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';
import { readJson, jsonError } from '@/server/http';

const checkoutSchema = z.object({
  cartId: z.string(),
  customerEmail: z.string().email().optional()
});

export async function POST(request: NextRequest) {
  const commerceEnabled = await ensureFeatureEnabled(request, 'commerce');
  if (!commerceEnabled) {
    return jsonError('Commerce feature disabled', 404);
  }

  const payload = (await readJson<unknown>(request)) ?? {};
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { id: parsed.data.cartId },
    include: { items: { include: { product: true } } }
  });

  if (!cart || cart.status !== 'OPEN') {
    return jsonError('Cart not found or closed', 404);
  }

  if (cart.items.length === 0) {
    return jsonError('Cart is empty', 400);
  }

  const customer = parsed.data.customerEmail
    ? await prisma.user.upsert({
        where: { email: parsed.data.customerEmail },
        create: { email: parsed.data.customerEmail, role: 'CUSTOMER' },
        update: {}
      })
    : undefined;

  const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdOrder = await tx.order.create({
      data: {
        totalCents: cart.totalCents,
        customerId: customer?.id
      }
    });

    type CartItemRecord = (typeof cart.items)[number];

    await Promise.all(
      cart.items.map((item: CartItemRecord) =>
        tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitCents: item.product.priceCents,
            currency: item.product.currency
          }
        })
      )
    );

    await tx.cart.update({
      where: { id: cart.id },
      data: { status: 'COMPLETED' }
    });

    return createdOrder;
  });

  return NextResponse.json(
    {
      orderId: order.id,
      orderNumber: order.displayId,
      totalCents: order.totalCents,
      currency: order.currency,
      createdAt: order.createdAt
    },
    { status: 201 }
  );
}
