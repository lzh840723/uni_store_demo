// demo-mode: local fallback data used when the backend is unavailable.
import type { Product, ProductListResponse, OrderDetail } from '../api/commerce';
import type { Post } from '../api/cms';

export const mockProducts: Product[] = [
  {
    id: 'mock-product-1',
    title: 'Mock Hoodie',
    slug: 'mock-hoodie',
    description: 'Placeholder product when the backend is offline.',
    priceCents: 4900,
    currency: 'USD',
    images: ['https://picsum.photos/seed/mock-hoodie/600/600']
  },
  {
    id: 'mock-product-2',
    title: 'Mock Tote Bag',
    slug: 'mock-tote',
    description: 'Default item for demo-only scenarios.',
    priceCents: 1900,
    currency: 'USD',
    images: ['https://picsum.photos/seed/mock-tote/600/600']
  }
];

export const mockProductsResponse: ProductListResponse = {
  items: mockProducts,
  count: mockProducts.length,
  limit: mockProducts.length,
  offset: 0
};

export const mockOrder: OrderDetail = {
  id: 'mock-order-1',
  displayId: 1001,
  totalCents: mockProducts.reduce((sum, item) => sum + item.priceCents, 0),
  currency: 'USD',
  createdAt: new Date().toISOString(),
  items: mockProducts.map((product) => ({
    id: `mock-item-${product.id}`,
    quantity: 1,
    unitCents: product.priceCents,
    currency: product.currency,
    product
  }))
};

export const mockPosts: Post[] = [
  {
    id: 'mock-post-1',
    title: 'Offline Demo Mode',
    slug: 'mock-post',
    excerpt: 'A placeholder article shown when the API is offline.',
    content: 'When the Node API is unavailable, the frontend falls back to local mock data.',
    publishedAt: new Date().toISOString()
  }
];
