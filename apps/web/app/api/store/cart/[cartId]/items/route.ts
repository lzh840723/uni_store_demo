import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';
import { readJson, jsonError } from '@/server/http';

const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive()
});

export async function POST(request: NextRequest, { params }: { params: { cartId: string } }) {
  const commerceEnabled = await ensureFeatureEnabled(request, 'commerce');
  if (!commerceEnabled) {
    return jsonError('Commerce feature disabled', 404);
  }

  const payload = (await readJson<unknown>(request)) ?? {};
  const parsed = addItemSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({ where: { id: params.cartId }, include: { items: true } });
  if (!cart || cart.status !== 'OPEN') {
    return jsonError('Cart not found or closed', 404);
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) {
    return jsonError('Product not found', 404);
  }

  type CartItemRecord = (typeof cart.items)[number];
  const existingItem = cart.items.find((item: CartItemRecord) => item.productId === product.id);

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + parsed.data.quantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: params.cartId,
        productId: product.id,
        quantity: parsed.data.quantity
      }
    });
  }

  const updatedItems = await prisma.cartItem.findMany({
    where: { cartId: params.cartId },
    include: { product: true }
  });

  type UpdatedItemRecord = (typeof updatedItems)[number];
  const totalCents = updatedItems.reduce((sum: number, item: UpdatedItemRecord) => sum + item.product.priceCents * item.quantity, 0);

  const updatedCart = await prisma.cart.update({
    where: { id: params.cartId },
    data: { totalCents },
    include: { items: { include: { product: true } } }
  });

  return NextResponse.json(updatedCart);
}
