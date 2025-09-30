'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { FeatureFlagProvider, type FeatureFlags } from './feature-flags';

export function Providers({ children, initialFlags }: { children: React.ReactNode; initialFlags: FeatureFlags }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={client}>
      <FeatureFlagProvider initialFlags={initialFlags}>{children}</FeatureFlagProvider>
    </QueryClientProvider>
  );
}
