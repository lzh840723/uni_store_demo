'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkoutCart } from '../lib/api/commerce';
import { useCartStore } from '../lib/store/cart-store';
import { formatCurrency } from '../lib/format';

export function CheckoutForm() {
  const router = useRouter();
  const { cart, cartId, hydrate, loading, reset } = useCartStore();
  const [email, setEmail] = useState('customer@unistore.dev');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    hydrate().catch(() => undefined);
  }, [hydrate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!cartId) {
      setError('购物车为空或已过期');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await checkoutCart(cartId, email);
      reset();
      router.push(`/store/orders/${result.orderId}?display=${result.orderNumber}`);
    } catch (submitError) {
      setError('提交失败，请重试');
      console.error(submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <form onSubmit={handleSubmit} className="surface" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <h1>结账</h1>
      {!cartId && <p style={{ color: '#ef4444' }}>当前没有购物车，请返回商品页添加商品。</p>}
      {cart && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>订单摘要</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cart.items.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  {item.product.title} × {item.quantity}
                </span>
                <span>{formatCurrency(item.product.priceCents * item.quantity, item.product.currency)}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 600 }}>
            <span>合计</span>
            <span>{formatCurrency(cart.totalCents, cart.currency)}</span>
          </div>
        </div>
      )}

      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        <span>联系邮箱</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{ padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(15, 23, 42, 0.2)' }}
        />
      </label>

      {error && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</p>}

      <button
        type="submit"
        disabled={isEmpty || submitting || loading}
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '999px',
          border: 'none',
          background: 'var(--color-primary)',
          color: '#fff',
          fontWeight: 600
        }}
      >
        {submitting ? '支付中…' : '模拟支付'}
      </button>
    </form>
  );
}
