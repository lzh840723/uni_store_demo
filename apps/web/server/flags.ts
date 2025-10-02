import type { FeatureFlags, FeatureKey } from '@/lib/feature-flags';
import { NextRequest } from 'next/server';

const TTL_MS = 60_000;
const cache = new Map<FeatureKey, { value: boolean; expiresAt: number }>();

function fallbackFlag(key: FeatureKey): boolean {
  const envKey = `FLAG_${key.toUpperCase()}`;
  const raw = process.env[envKey];
  if (typeof raw === 'string') {
    return ['1', 'true', 'on', 'yes'].includes(raw.toLowerCase());
  }
  return true;
}

async function fetchFlagFromUnleash(key: FeatureKey): Promise<boolean | undefined> {
  const baseUrl = process.env.UNLEASH_URL;
  const token = process.env.UNLEASH_API_TOKEN;
  if (!baseUrl || !token) return undefined;

  const endpoint = new URL(`/client/features/${key}`, baseUrl);

  try {
    const response = await fetch(endpoint.toString(), {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) return undefined;
    const payload = (await response.json()) as { enabled?: boolean };
    return typeof payload.enabled === 'boolean' ? payload.enabled : undefined;
  } catch (error) {
    console.warn('[flags] Failed to reach Unleash', error);
    return undefined;
  }
}

async function getFlagFromSources(key: FeatureKey): Promise<boolean> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const unleashValue = await fetchFlagFromUnleash(key);
  const fallback = fallbackFlag(key);
  const resolved = typeof unleashValue === 'boolean' ? unleashValue : fallback;

  cache.set(key, { value: resolved, expiresAt: now + TTL_MS });
  return resolved;
}

function applyCookieOverrides(request: NextRequest | undefined, flags: FeatureFlags): FeatureFlags {
  if (!request) return flags;
  const next = { ...flags };
  for (const key of Object.keys(next) as FeatureKey[]) {
    const cookie = request.cookies.get(`flag_${key}`)?.value;
    if (cookie) {
      next[key] = cookie === 'true';
    }
  }
  return next;
}

export async function resolveFlags(request?: NextRequest): Promise<FeatureFlags> {
  const keys = ['commerce', 'cms', 'analytics'] as const;
  const entries = await Promise.all(
    keys.map(async (key) => {
      const value = await getFlagFromSources(key);
      return [key, value] as const;
    })
  );

  const flags = Object.fromEntries(entries) as FeatureFlags;
  return applyCookieOverrides(request, flags);
}

export async function ensureFeatureEnabled(request: NextRequest | undefined, key: FeatureKey): Promise<boolean> {
  const flags = await resolveFlags(request);
  return flags[key];
}
