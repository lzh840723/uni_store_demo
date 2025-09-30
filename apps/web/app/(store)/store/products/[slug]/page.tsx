import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchProduct } from '@/lib/api/commerce';
import { formatCurrency } from '@/lib/format';
import { AddToCartButton } from '@/components/AddToCartButton';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug).catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <article className="surface" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: '12px', overflow: 'hidden' }}>
        <Image src={product.images?.[0] ?? 'https://picsum.photos/seed/unistore/600/600'} alt={product.title} fill style={{ objectFit: 'cover' }} />
      </div>
      <div>
        <h1 style={{ marginTop: 0 }}>{product.title}</h1>
        <p style={{ color: 'rgba(15,23,42,0.7)', lineHeight: 1.6 }}>{product.description}</p>
        <strong style={{ fontSize: '1.5rem' }}>{formatCurrency(product.priceCents, product.currency)}</strong>
        <AddToCartButton productId={product.id} />
      </div>
    </article>
  );
}
