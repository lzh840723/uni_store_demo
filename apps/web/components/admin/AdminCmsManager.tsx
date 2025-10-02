'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminCreatePost, adminDeletePost, adminUpdatePost, fetchPosts, type Post } from '../../lib/api/cms';

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: ''
};

export function AdminCmsManager() {
  const queryClient = useQueryClient();
  const { data: posts } = useQuery({ queryKey: ['cms', 'posts'], queryFn: fetchPosts });
  const [form, setForm] = useState(emptyPost);
  const [editing, setEditing] = useState<Post | null>(null);

  const upsert = useMutation({
    mutationFn: async (payload: typeof emptyPost) => {
      if (editing) {
        return adminUpdatePost(editing.id, payload);
      }
      return adminCreatePost(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'posts'] });
      setForm(emptyPost);
      setEditing(null);
    }
  });

  const remove = useMutation({
    mutationFn: adminDeletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', 'posts'] })
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    upsert.mutate(form);
  };

  return (
    <div className="surface">
      <h1 style={{ marginTop: 0 }}>CMS management</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Title</span>
          <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Slug</span>
          <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} required />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Excerpt</span>
          <textarea value={form.excerpt} onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))} rows={2} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>Content</span>
          <textarea value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} rows={5} required />
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff' }}>
            {editing ? 'Save article' : 'Create article'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyPost);
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
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts?.map((post) => (
            <tr key={post.id} style={{ borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
              <td>{post.title}</td>
              <td>{post.slug}</td>
              <td>{new Date(post.publishedAt).toLocaleString('en-US')}</td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(post);
                    setForm({
                      title: post.title,
                      slug: post.slug,
                      excerpt: post.excerpt ?? '',
                      content: post.content
                    });
                  }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove.mutate(post.id)}
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
