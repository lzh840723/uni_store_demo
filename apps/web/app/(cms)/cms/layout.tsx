import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { fetchFeatureFlags } from '../../../lib/flags.server';

export default async function CmsLayout({ children }: { children: ReactNode }) {
  const flags = await fetchFeatureFlags();
  if (!flags.cms) {
    notFound();
  }
  return <div style={{ marginTop: '1.5rem' }}>{children}</div>;
}
