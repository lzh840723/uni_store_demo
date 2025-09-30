import { cache } from 'react';
import { cookies } from 'next/headers';
import type { FeatureFlags, FeatureKey } from './feature-flags';
import { apiFetch } from './api/http';

export const fetchFeatureFlags = cache(async (): Promise<FeatureFlags> => {
  try {
    const flags = await apiFetch<FeatureFlags>('/api/flags');
    return applyCookieOverrides(flags);
  } catch (error) {
    console.warn('[flags] fallback to env flags', error);
    return applyCookieOverrides({
      commerce: process.env.FLAG_COMMERCE !== 'false',
      cms: process.env.FLAG_CMS !== 'false',
      analytics: process.env.FLAG_ANALYTICS !== 'false'
    });
  }
});

function applyCookieOverrides(flags: FeatureFlags): FeatureFlags {
  const store = cookies();
  const next = { ...flags };
  (Object.keys(flags) as FeatureKey[]).forEach((key) => {
    const cookie = store.get(`flag_${key}`)?.value;
    if (cookie) {
      next[key] = cookie === 'true';
    }
  });
  return next;
}
