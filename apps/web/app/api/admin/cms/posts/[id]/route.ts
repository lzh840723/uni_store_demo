import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';
import { isRole } from '@/server/roles';
import { jsonError, readJson } from '@/server/http';
import { postPayloadSchema } from '@/server/schemas';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'cms'))) {
    return jsonError('CMS feature disabled', 404);
  }

  const payload = (await readJson<unknown>(request)) ?? {};
  const parsed = postPayloadSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const post = await prisma.post.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: 'Post not found', error: String(error) }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'cms'))) {
    return jsonError('CMS feature disabled', 404);
  }

  try {
    await prisma.post.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: 'Post not found', error: String(error) }, { status: 404 });
  }
}
