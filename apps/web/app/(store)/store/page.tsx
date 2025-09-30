import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts } from '@/lib/api/commerce';
import { formatCurrency } from '@/lib/format';

export default async function StorefrontPage() {
  const { items } = await fetchProducts();

  return (
    <section className="card-grid">
      {items.map((product) => (
        <Link key={product.id} href={`/store/products/${product.slug}`} className="surface">
          <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', borderRadius: '12px', overflow: 'hidden' }}>
            <Image src={product.images?.[0] ?? 'https://picsum.photos/seed/unistore/600/600'} alt={product.title} fill style={{ objectFit: 'cover' }} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>{product.title}</h3>
          <span style={{ fontWeight: 600 }}>{formatCurrency(product.priceCents, product.currency)}</span>
        </Link>
      ))}
    </section>
  );
}
