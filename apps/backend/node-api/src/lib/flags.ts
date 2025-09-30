import { config } from '../config/env.js';

type FlagKey = 'commerce' | 'cms' | 'analytics';

type CacheEntry = {
  value: boolean;
  expiresAt: number;
};

const ttlMs = 60_000;
const cache = new Map<FlagKey, CacheEntry>();

async function fetchFlagFromUnleash(key: FlagKey): Promise<boolean | undefined> {
  if (!config.unleashUrl || !config.unleashToken) return undefined;

  const endpoint = new URL(`/client/features/${key}`, config.unleashUrl);
  try {
    const response = await fetch(endpoint.toString(), {
      headers: {
        Authorization: config.unleashToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return undefined;
    }

    const data = (await response.json()) as { enabled?: boolean };
    return data.enabled ?? undefined;
  } catch (error) {
    console.warn('[flags] Failed to reach Unleash', error);
    return undefined;
  }
}

export async function getFlag(key: FlagKey): Promise<boolean> {
  const cached = cache.get(key);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const unleashValue = await fetchFlagFromUnleash(key);
  const fallback = config.flags[key];
  const value = typeof unleashValue === 'boolean' ? unleashValue : fallback;

  cache.set(key, { value, expiresAt: now + ttlMs });
  return value;
}
