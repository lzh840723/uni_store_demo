import { apiFetch } from './http';
import { mockOrder, mockProducts, mockProductsResponse } from '../mock/data';

export type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  priceCents: number;
  currency: string;
  images: string[];
};

export type ProductListResponse = {
  items: Product[];
  count: number;
  limit: number;
  offset: number;
};

export type Cart = {
  id: string;
  status: 'OPEN' | 'COMPLETED';
  totalCents: number;
  currency: string;
  items: Array<{
    id: string;
    quantity: number;
    product: Product;
  }>;
};

export type OrderDetail = {
  id: string;
  displayId: number;
  totalCents: number;
  currency: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitCents: number;
    currency: string;
    product: Product;
  }>;
};

export async function fetchProducts(): Promise<ProductListResponse> {
  try {
    return await apiFetch('/api/store/products');
  } catch (error) {
    console.warn('[commerce] fallback to mock products', error);
    return mockProductsResponse;
  }
}

export async function fetchProduct(idOrSlug: string): Promise<Product> {
  try {
    return await apiFetch(`/api/store/products/${idOrSlug}`);
  } catch (error) {
    console.warn('[commerce] fallback to mock product', error);
    return mockProducts.find((item) => item.id === idOrSlug || item.slug === idOrSlug) ?? mockProducts[0];
  }
}

export async function createCart(): Promise<{ cartId: string; totalCents: number; items: [] }> {
  return apiFetch('/api/store/cart', { method: 'POST', body: JSON.stringify({}) });
}

export async function addToCart(cartId: string, productId: string, quantity: number) {
  return apiFetch<Cart>(`/api/store/cart/${cartId}/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  });
}

export async function fetchCart(cartId: string) {
  return apiFetch<Cart>(`/api/store/cart/${cartId}`);
}

export async function checkoutCart(cartId: string, customerEmail?: string) {
  return apiFetch<{ orderId: string; orderNumber: number; totalCents: number; currency: string; createdAt: string }>(
    '/api/store/checkout',
    {
      method: 'POST',
      body: JSON.stringify({ cartId, customerEmail })
    }
  );
}

export async function fetchOrder(orderId: string): Promise<OrderDetail> {
  try {
    return await apiFetch(`/api/store/orders/${orderId}`);
  } catch (error) {
    console.warn('[commerce] fallback to mock order', error);
    return mockOrder;
  }
}
