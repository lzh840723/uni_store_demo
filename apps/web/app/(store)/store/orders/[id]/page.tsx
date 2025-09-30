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
      <h1>订单确认</h1>
      <p>感谢你的购买！以下是订单摘要。</p>
      <p>
        订单号：<strong>{searchParams.display ?? order.displayId ?? order.id}</strong>
      </p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {order.items.map((item) => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {item.product?.title ?? '商品'} × {item.quantity}
            </span>
            <span>{formatCurrency(item.unitCents * item.quantity, item.currency)}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontWeight: 600 }}>
        <span>合计</span>
        <span>{formatCurrency(order.totalCents, order.currency)}</span>
      </div>
      <Link href="/store" style={{ marginTop: '1.5rem', display: 'inline-block', color: 'var(--color-primary)' }}>
        返回继续购物
      </Link>
    </section>
  );
}
