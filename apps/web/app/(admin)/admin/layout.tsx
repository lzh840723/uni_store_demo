import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { fetchFeatureFlags } from '../../../lib/flags.server';
import { getCurrentRole } from '../../../lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const flags = await fetchFeatureFlags();
  const role = getCurrentRole();

  if (!flags.commerce || role !== 'ADMIN') {
    notFound();
  }

  return <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.5rem' }}>{children}</div>;
}
