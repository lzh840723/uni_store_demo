import express from 'express';
import { prisma } from '../lib/prisma.js';
import { requireFlag } from '../middleware/featureFlagGuard.js';

const router = express.Router();

router.get('/posts', requireFlag('cms'), async (_req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true
    }
  });

  return res.json(posts);
});

router.get('/posts/:slug', requireFlag('cms'), async (req, res) => {
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  return res.json(post);
});

export const cmsRouter = router;
