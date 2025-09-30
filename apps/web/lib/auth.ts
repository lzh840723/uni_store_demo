import { cookies } from 'next/headers';

export type Role = 'ADMIN' | 'CUSTOMER';

export function getCurrentRole(): Role {
  const cookieStore = cookies();
  const roleCookie = cookieStore.get('role')?.value?.toUpperCase();
  return roleCookie === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
}

export function isAdmin(): boolean {
  return getCurrentRole() === 'ADMIN';
}
