'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import type { Role } from '../lib/auth';
import { useFeatureFlags } from '../lib/feature-flags';
import { RoleSwitcher } from './RoleSwitcher';
import { FlagToggle } from './FlagToggle';

const links = [
  { href: '/store', label: 'Storefront', feature: 'commerce', roles: ['ADMIN', 'CUSTOMER'] as Role[] },
  { href: '/admin', label: 'Admin', feature: 'commerce', roles: ['ADMIN'] as Role[] },
  { href: '/cms', label: 'CMS', feature: 'cms', roles: ['ADMIN', 'CUSTOMER'] as Role[] }
];

type Props = {
  role: Role;
};

export function Navbar({ role }: Props) {
  const pathname = usePathname();
  const { flags } = useFeatureFlags();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(12px)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        background: 'rgba(255,255,255,0.85)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link href="/" style={{ fontWeight: 600, fontSize: '1.1rem' }}>
          UniStore Demo
        </Link>
        <span style={{ fontSize: '0.75rem', color: 'rgba(15, 23, 42, 0.6)' }}>React / Next.js + Node API</span>
      </div>

      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        {links
          .filter((link) => flags[link.feature as keyof typeof flags])
          .filter((link) => link.roles.includes(role))
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx('nav-link', {
                active: pathname.startsWith(link.href)
              })}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                border: '1px solid rgba(37, 99, 235, 0.16)',
                background: pathname.startsWith(link.href) ? 'var(--color-primary)' : 'transparent',
                color: pathname.startsWith(link.href) ? '#fff' : 'var(--color-primary)',
                fontSize: '0.9rem'
              }}
            >
              {link.label}
            </Link>
          ))}
      </nav>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <RoleSwitcher role={role} />
        <FlagToggle />
      </div>
    </header>
  );
}
