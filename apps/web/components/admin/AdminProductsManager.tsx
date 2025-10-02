'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminCreateProduct, adminDeleteProduct, adminFetchProducts, adminUpdateProduct } from '../../lib/api/admin';
import type { Product } from '../../lib/api/commerce';
import { formatCurrency } from '../../lib/format';

const emptyForm = {
  title: '',
  slug: '',
  priceCents: 0,
  currency: 'USD',
  image: ''
};

export function AdminProductsManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Product | null>(null);

  const { data: products } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: adminFetchProducts
  });

  const upsertMutation = useMutation({
    mutationFn: async (payload: typeof emptyForm) => {
      if (editing) {
        return adminUpdateProduct(editing.id, {
          title: payload.title,
          slug: payload.slug,
          priceCents: payload.priceCents,
          currency: payload.currency,
          images: payload.image ? [payload.image] : []
        });
      }
      return adminCreateProduct({
        title: payload.title,
        slug: payload.slug,
        priceCents: payload.priceCents,
        currency: payload.currency,
        images: payload.image ? [payload.image] : []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setForm(emptyForm);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    upsertMutation.mutate(form);
  };

  return (
    <div className="surface">
      <h1 style={{ marginTop: 0 }}>Product management</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Title</span>
          <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Slug</span>
          <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} required />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Price (cents)</span>
          <input
            type="number"
            value={form.priceCents}
            onChange={(event) => setForm((prev) => ({ ...prev, priceCents: Number(event.target.value) }))}
            min={0}
            required
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Currency</span>
          <input value={form.currency} onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Image URL</span>
          <input value={form.image} onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))} />
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <button type="submit" style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff' }}>
            {editing ? 'Save changes' : 'Create product'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
              style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.2)', background: 'transparent' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(15,23,42,0.1)' }}>
            <th>Title</th>
            <th>Slug</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} style={{ borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
              <td>{product.title}</td>
              <td>{product.slug}</td>
              <td>{formatCurrency(product.priceCents, product.currency)}</td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(product);
                    setForm({
                      title: product.title,
                      slug: product.slug,
                      priceCents: product.priceCents,
                      currency: product.currency,
                      image: product.images?.[0] ?? ''
                    });
                  }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(product.id)}
                  style={{ border: 'none', background: 'transparent', color: '#ef4444' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
