import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchOrder } from '../../../../lib/api/commerce';
import { formatCurrency } from '../../../../lib/format';

export default async function OrderDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { display?: string } }) {
  const order = await fetchOrder(params.id).catch(() => null);

  if (!order) {
    notFound();
  }

  return (
    <section className="surface" style={{ maxWidth: '640px', margin: '0 auto', marginTop: '2rem' }}>
      <h1>Order confirmation</h1>
      <p>Thanks for your purchase! Below is the order summary.</p>
      <p>
        Order #: <strong>{searchParams.display ?? order.displayId ?? order.id}</strong>
      </p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {order.items.map((item) => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {item.product?.title ?? 'Item'} × {item.quantity}
            </span>
            <span>{formatCurrency(item.unitCents * item.quantity, item.currency)}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontWeight: 600 }}>
        <span>Total</span>
        <span>{formatCurrency(order.totalCents, order.currency)}</span>
      </div>
      <Link href="/store" style={{ marginTop: '1.5rem', display: 'inline-block', color: 'var(--color-primary)' }}>
        Continue shopping
      </Link>
    </section>
  );
}
