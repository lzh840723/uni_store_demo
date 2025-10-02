import { redirect } from 'next/navigation';
import { fetchFeatureFlags } from '@/lib/flags.server';
import { getCurrentRole } from '@/lib/auth';

export default async function AnalyticsProxyPage() {
  const flags = await fetchFeatureFlags();
  const role = getCurrentRole();

  if (!flags.analytics) {
    redirect('/');
  }

  if (role !== 'ADMIN') {
    redirect('/403');
  }

  redirect('/admin/analytics');
}
