'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const FEATURE_KEYS = ['commerce', 'cms', 'analytics'] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];
export type FeatureFlags = Record<FeatureKey, boolean>;

type FeatureFlagContextValue = {
  flags: FeatureFlags;
  setFlag: (key: FeatureKey, value: boolean) => void;
};

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);
const STORAGE_KEY = 'unistore.flags.override';

type Props = {
  initialFlags: FeatureFlags;
  children: React.ReactNode;
};

function readOverrides(): Partial<FeatureFlags> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const overrides = raw ? (JSON.parse(raw) as Partial<FeatureFlags>) : {};
    const cookieEntries = document.cookie
      .split(';')
      .map((entry) => entry.trim().split('='))
      .filter(([name]) => name?.startsWith('flag_')) as [string, string][];
    cookieEntries.forEach(([name, value]) => {
      const key = name.replace('flag_', '') as FeatureKey;
      overrides[key] = value === 'true';
    });
    return overrides;
  } catch (error) {
    console.warn('[flags] failed to parse overrides', error);
    return null;
  }
}

function writeOverrides(overrides: Partial<FeatureFlags>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function FeatureFlagProvider({ initialFlags, children }: Props) {
  const [flags, setFlags] = useState<FeatureFlags>(initialFlags);

  useEffect(() => {
    const overrides = readOverrides();
    if (overrides) {
      setFlags((prev) => ({ ...prev, ...overrides }));
    }
  }, []);

  const setFlag = useCallback((key: FeatureKey, value: boolean) => {
    setFlags((prev) => {
      const next = { ...prev, [key]: value };
      const overrides = readOverrides() ?? {};
      overrides[key] = value;
      writeOverrides(overrides);
      if (typeof document !== 'undefined') {
        document.cookie = `flag_${key}=${value}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ flags, setFlag }), [flags, setFlag]);
  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}

export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    throw new Error('FeatureFlagProvider missing');
  }
  return ctx;
}

export function useFeatureEnabled(key: FeatureKey) {
  const ctx = useFeatureFlags();
  return ctx.flags[key];
}
