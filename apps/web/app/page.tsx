import Link from 'next/link';
import { fetchFeatureFlags } from '../lib/flags.server';

const cards = [
  {
    href: '/store',
    title: 'Storefront',
    description: 'Browse products, add items to the cart, and run through the mock checkout.',
    feature: 'commerce'
  },
  {
    href: '/admin',
    title: 'Admin',
    description: 'Manage products, orders, and users, and monitor 7-day GMV.',
    feature: 'commerce'
  },
  {
    href: '/cms',
    title: 'CMS',
    description: 'Read demo articles and explore the lightweight CMS demo.',
    feature: 'cms'
  }
] as const;

export default async function HomePage() {
  const flags = await fetchFeatureFlags();

  return (
    <section className="surface" style={{ marginTop: '2rem' }}>
      <h1 style={{ marginTop: 0 }}>UniStore Multi-entry Demo</h1>
      <p style={{ maxWidth: '640px', color: 'rgba(15, 23, 42, 0.7)' }}>
        Use the RoleSwitcher and FlagToggle in the navbar to jump between Admin and Customer
        perspectives or disable modules when demonstrating feature flags.
      </p>
      <div className="card-grid" style={{ marginTop: '2rem' }}>
        {cards.map((card) => {
          const disabled = !flags[card.feature as keyof typeof flags];
          return (
            <Link
              key={card.href}
              href={disabled ? '#' : card.href}
              className="surface"
              style={{
                opacity: disabled ? 0.4 : 1,
                pointerEvents: disabled ? 'none' : 'auto',
                border: '1px solid rgba(37, 99, 235, 0.1)'
              }}
            >
              <h2 style={{ marginTop: 0 }}>{card.title}</h2>
              <p style={{ fontSize: '0.95rem', color: 'rgba(15, 23, 42, 0.7)' }}>{card.description}</p>
              <span style={{ fontSize: '0.8rem', color: disabled ? '#ef4444' : '#16a34a' }}>
                Flag: {disabled ? 'OFF' : 'ON'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
