import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';
import { isRole } from '@/server/roles';
import { readJson, jsonError } from '@/server/http';
import { productPayloadSchema } from '@/server/schemas';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'commerce'))) {
    return jsonError('Commerce feature disabled', 404);
  }

  const payload = (await readJson<unknown>(request)) ?? {};
  const parsed = productPayloadSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return jsonError('Product not found', 404);
    }

    return NextResponse.json({ message: 'Unable to update product', error: String(error) }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'commerce'))) {
    return jsonError('Commerce feature disabled', 404);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { productId: params.id } });
      await tx.product.delete({ where: { id: params.id } });
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return jsonError('Product not found', 404);
      }

      if (error.code === 'P2003') {
        return jsonError('Cannot delete product with existing order history', 409);
      }
    }

    return NextResponse.json({ message: 'Unable to delete product', error: String(error) }, { status: 400 });
  }
}
