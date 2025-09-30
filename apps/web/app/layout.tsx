import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '../lib/providers';
import { fetchFeatureFlags } from '../lib/flags.server';
import { getCurrentRole } from '../lib/auth';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'UniStore Demo',
  description: '多入口电商 + CMS + Admin 演示项目'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await fetchFeatureFlags();
  const role = getCurrentRole();

  return (
    <html lang="zh-CN">
      <body>
        <Providers initialFlags={flags}>
          <Navbar role={role} />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
