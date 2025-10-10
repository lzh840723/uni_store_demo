import { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { fetchFeatureFlags } from '@/lib/flags.server';
import { getCurrentRole } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const flags = await fetchFeatureFlags();
  const role = getCurrentRole();

  // If commerce module is off, return 404 to indicate the section is unavailable
  if (!flags.commerce) {
    notFound();
  }

  // When role is not ADMIN, send user to dedicated 403 page instead of 404
  // This avoids ambiguous 404 when middleware is skipped in some hosts
  if (role !== 'ADMIN') {
    redirect('/403');
  }

  return <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.5rem' }}>{children}</div>;
}
