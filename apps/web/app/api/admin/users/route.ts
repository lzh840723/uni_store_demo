import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { isRole } from '@/server/roles';
import { jsonError } from '@/server/http';

export async function GET(request: NextRequest) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(users);
}
