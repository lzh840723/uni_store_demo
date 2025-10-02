import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { isRole } from '@/server/roles';
import { jsonError, readJson } from '@/server/http';
import { updateRoleSchema } from '@/server/schemas';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isRole(request, 'ADMIN')) {
    return jsonError('Forbidden: role mismatch', 403);
  }

  const payload = (await readJson<unknown>(request)) ?? {};
  const parsed = updateRoleSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({ where: { id: params.id }, data: { role: parsed.data.role } });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'User not found', error: String(error) }, { status: 404 });
  }
}
