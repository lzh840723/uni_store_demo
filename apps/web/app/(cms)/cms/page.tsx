import Link from 'next/link';
import { fetchPosts } from '../../../lib/api/cms';

export default async function CmsPage() {
  const posts = await fetchPosts();

  return (
    <section className="card-grid">
      {posts.map((post) => (
        <Link key={post.id} href={`/cms/${post.slug}`} className="surface">
          <h2 style={{ marginTop: 0 }}>{post.title}</h2>
          <p style={{ color: 'rgba(15,23,42,0.7)', fontSize: '0.95rem' }}>{post.excerpt}</p>
          <span style={{ fontSize: '0.8rem', color: 'rgba(15,23,42,0.6)' }}>
            {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
          </span>
        </Link>
      ))}
    </section>
  );
}
