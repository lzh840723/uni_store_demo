import { NextRequest } from 'next/server';
import type { Role } from '@/lib/auth';

export function getRoleFromRequest(request: NextRequest): Role {
  const headerRole = request.headers.get('x-demo-role');
  const cookieRole = request.cookies.get('role')?.value;
  const resolved = (headerRole ?? cookieRole ?? '').toUpperCase();
  return resolved === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
}

export function isRole(request: NextRequest, role: Role): boolean {
  return getRoleFromRequest(request) === role;
}
