import { notFound } from 'next/navigation';
import { fetchPost } from '../../../../lib/api/cms';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug).catch(() => null);
  if (!post) {
    notFound();
  }

  return (
    <article className="surface" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>{post.title}</h1>
      <p style={{ color: 'rgba(15,23,42,0.6)', fontSize: '0.9rem' }}>
        Published on {new Date(post.publishedAt).toLocaleString('en-US')}
      </p>
      <div style={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>{post.content}</div>
    </article>
  );
}
