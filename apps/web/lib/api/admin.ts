import { apiFetch } from './http';
import type { Product } from './commerce';

export type Order = {
  id: string;
  displayId: number;
  totalCents: number;
  currency: string;
  status: string;
  createdAt: string;
  customer?: { id: string; email: string } | null;
};

export type User = {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  name?: string | null;
};

export type AnalyticsResponse = {
  labels: string[];
  data: {
    count: number[];
    gmv: number[];
  };
};

export function adminFetchProducts() {
  return apiFetch<Product[]>('/api/admin/products', {
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminCreateProduct(payload: Partial<Product>) {
  return apiFetch<Product>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminUpdateProduct(id: string, payload: Partial<Product>) {
  return apiFetch<Product>(`/api/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminDeleteProduct(id: string) {
  return apiFetch<void>(`/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminFetchOrders() {
  return apiFetch<Order[]>('/api/admin/orders', {
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminFetchUsers() {
  return apiFetch<User[]>('/api/admin/users', {
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminUpdateUserRole(id: string, role: User['role']) {
  return apiFetch<User>(`/api/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminFetchAnalytics(): Promise<AnalyticsResponse> {
  return apiFetch('/api/admin/analytics/orders-7d', {
    headers: { 'x-demo-role': 'ADMIN' }
  });
}
