'use client';

import { FEATURE_KEYS, useFeatureFlags } from '../lib/feature-flags';

export function FlagToggle() {
  const { flags, setFlag } = useFeatureFlags();

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      {FEATURE_KEYS.map((key) => (
        <label key={key} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
          <input
            type="checkbox"
            checked={flags[key]}
            onChange={(event) => setFlag(key, event.target.checked)}
          />
          {key}
        </label>
      ))}
    </div>
  );
}
