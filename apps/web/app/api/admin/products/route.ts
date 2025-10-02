import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';
import { isRole } from '@/server/roles';
import { readJson, jsonError } from '@/server/http';
import { productPayloadSchema } from '@/server/schemas';

export async function GET(request: NextRequest) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'commerce'))) {
    return jsonError('Commerce feature disabled', 404);
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'commerce'))) {
    return jsonError('Commerce feature disabled', 404);
  }

  const payload = (await readJson<unknown>(request)) ?? {};
  const parsed = productPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Unable to create product', error: String(error) }, { status: 400 });
  }
}
