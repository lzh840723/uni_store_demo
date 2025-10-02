import Link from 'next/link';

const cards = [
  {
    href: '/admin/products',
    title: 'Product Management',
    description: 'Create, edit, and delete products that sync to the storefront.'
  },
  {
    href: '/admin/orders',
    title: 'Order Center',
    description: 'Review the latest 7 days of orders and payment status.'
  },
  {
    href: '/admin/users',
    title: 'User Roles',
    description: 'Toggle demo users between Admin and Customer roles.'
  },
  {
    href: '/admin/analytics',
    title: 'Analytics',
    description: 'Track 7-day order counts and GMV trends.'
  },
  {
    href: '/admin/cms',
    title: 'CMS Management',
    description: 'Maintain demo articles, or jump into the Keystone admin when enabled.'
  }
];

export default function AdminHomePage() {
  return (
    <section className="card-grid">
      {cards.map((card) => (
        <Link key={card.href} href={card.href} className="surface">
          <h2 style={{ marginTop: 0 }}>{card.title}</h2>
          <p style={{ color: 'rgba(15,23,42,0.7)', fontSize: '0.95rem' }}>{card.description}</p>
        </Link>
      ))}
    </section>
  );
}
