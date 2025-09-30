// demo-mode: 本地假数据，用于后端不可用时的降级体验。
import type { Product, ProductListResponse, OrderDetail } from '../api/commerce';
import type { Post } from '../api/cms';

export const mockProducts: Product[] = [
  {
    id: 'mock-product-1',
    title: 'Mock Hoodie',
    slug: 'mock-hoodie',
    description: '后端离线时使用的占位商品。',
    priceCents: 4900,
    currency: 'USD',
    images: ['https://picsum.photos/seed/mock-hoodie/600/600']
  },
  {
    id: 'mock-product-2',
    title: 'Mock Tote Bag',
    slug: 'mock-tote',
    description: '演示模式下的默认商品。',
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
    title: '后端离线演示',
    slug: 'mock-post',
    excerpt: '这是一个演示模式下的占位文章。',
    content: '当 Node API 暂不可用时，前端会退化到本地 mock 数据。',
    publishedAt: new Date().toISOString()
  }
];
