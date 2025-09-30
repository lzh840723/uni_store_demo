import { apiFetch } from './http';
import { mockPosts } from '../mock/data';

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  publishedAt: string;
};

export async function fetchPosts(): Promise<Post[]> {
  try {
    return await apiFetch('/api/cms/posts');
  } catch (error) {
    console.warn('[cms] fallback to mock posts', error);
    return mockPosts;
  }
}

export async function fetchPost(slug: string): Promise<Post> {
  try {
    return await apiFetch(`/api/cms/posts/${slug}`);
  } catch (error) {
    console.warn('[cms] fallback to mock post', error);
    return mockPosts.find((post) => post.slug === slug) ?? mockPosts[0];
  }
}

export function adminCreatePost(payload: Partial<Post>) {
  return apiFetch<Post>('/api/admin/cms/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminUpdatePost(id: string, payload: Partial<Post>) {
  return apiFetch<Post>(`/api/admin/cms/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: { 'x-demo-role': 'ADMIN' }
  });
}

export function adminDeletePost(id: string) {
  return apiFetch<void>(`/api/admin/cms/posts/${id}`, {
    method: 'DELETE',
    headers: { 'x-demo-role': 'ADMIN' }
  });
}
