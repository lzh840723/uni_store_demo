import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureFeatureEnabled } from '@/server/flags';

export async function GET(request: NextRequest) {
  if (!(await ensureFeatureEnabled(request, 'cms'))) {
    return NextResponse.json({ message: 'CMS feature disabled' }, { status: 404 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true
    }
  });

  return NextResponse.json(posts);
}
