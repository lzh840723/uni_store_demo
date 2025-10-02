import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import { fetchFeatureFlags } from '@/lib/flags.server';
import { getCurrentRole } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'UniStore Demo',
  description: 'Multi-entry ecommerce, admin, and CMS showcase'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await fetchFeatureFlags();
  const role = getCurrentRole();

  return (
    <html lang="en">
      <body>
        <Providers initialFlags={flags}>
          <Navbar role={role} />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
