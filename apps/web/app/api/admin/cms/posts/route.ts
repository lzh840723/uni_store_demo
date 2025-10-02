import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';
import { isRole } from '@/server/roles';
import { jsonError, readJson } from '@/server/http';
import { postPayloadSchema } from '@/server/schemas';

export async function POST(request: NextRequest) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  if (!(await ensureFeatureEnabled(request, 'cms'))) {
    return jsonError('CMS feature disabled', 404);
  }

  const payload = (await readJson<unknown>(request)) ?? {};
  const parsed = postPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      authorId: request.cookies.get('userId')?.value ?? undefined
    }
  });

  return NextResponse.json(post, { status: 201 });
}
