'use client';

import { useState } from 'react';
import { useCartStore } from '../lib/store/cart-store';

export function AddToCartButton({ productId }: { productId: string }) {
  const { addItem, loading } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    await addItem(productId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '999px',
        background: 'var(--color-primary)',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      {loading ? '处理中…' : '加入购物车'}
      {added && <span style={{ fontSize: '0.8rem' }}>✓ 已加入</span>}
    </button>
  );
}
