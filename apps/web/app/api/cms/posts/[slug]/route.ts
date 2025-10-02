import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  if (!(await ensureFeatureEnabled(request, 'cms'))) {
    return NextResponse.json({ message: 'CMS feature disabled' }, { status: 404 });
  }

  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}
