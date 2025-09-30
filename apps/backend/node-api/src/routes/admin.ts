import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../middleware/roleGuard.js';
import { requireFlag } from '../middleware/featureFlagGuard.js';

const router = express.Router();
router.use(requireRole('ADMIN'));

const productPayload = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().default('USD'),
  images: z.array(z.string().url()).default([])
});

router.get('/products', requireFlag('commerce'), async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json(products);
});

router.post('/products', requireFlag('commerce'), async (req, res) => {
  const parsed = productPayload.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
  }

  try {
    const product = await prisma.product.create({ data: parsed.data });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: 'Unable to create product', error: String(error) });
  }
});

router.patch('/products/:id', requireFlag('commerce'), async (req, res) => {
  const parsed = productPayload.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
  }

  try {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: parsed.data });
    return res.json(product);
  } catch (error) {
    return res.status(404).json({ message: 'Product not found', error: String(error) });
  }
});

router.delete('/products/:id', requireFlag('commerce'), async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ message: 'Product not found', error: String(error) });
  }
});

router.get('/orders', requireFlag('commerce'), async (req, res) => {
  const from = typeof req.query.from === 'string' ? new Date(req.query.from) : undefined;
  const orders = await prisma.order.findMany({
    where: from ? { createdAt: { gte: from } } : undefined,
    include: { items: true, customer: true },
    orderBy: { createdAt: 'desc' }
  });

  return res.json(orders);
});

const updateRoleSchema = z.object({ role: z.enum(['ADMIN', 'CUSTOMER']) });

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json(users);
});

router.patch('/users/:id/role', async (req, res) => {
  const parsed = updateRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
  }

  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { role: parsed.data.role } });
    return res.json(user);
  } catch (error) {
    return res.status(404).json({ message: 'User not found', error: String(error) });
  }
});

router.get('/analytics/orders-7d', requireFlag('analytics'), async (_req, res) => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start } }
  });

  const labels: string[] = [];
  const count: number[] = [];
  const gmv: number[] = [];

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const dayOrders = orders.filter((order) => order.createdAt >= day && order.createdAt < nextDay);
    labels.push(day.toISOString().slice(0, 10));
    count.push(dayOrders.length);
    gmv.push(dayOrders.reduce((sum, order) => sum + order.totalCents, 0));
  }

  return res.json({ labels, data: { count, gmv } });
});

const postPayload = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  content: z.string(),
  publishedAt: z.coerce.date().optional()
});

router.post('/cms/posts', requireFlag('cms'), async (req, res) => {
  const parsed = postPayload.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
  }

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      authorId: req.cookies?.userId ?? undefined
    }
  });

  return res.status(201).json(post);
});

router.patch('/cms/posts/:id', requireFlag('cms'), async (req, res) => {
  const parsed = postPayload.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
  }

  try {
    const post = await prisma.post.update({ where: { id: req.params.id }, data: parsed.data });
    return res.json(post);
  } catch (error) {
    return res.status(404).json({ message: 'Post not found', error: String(error) });
  }
});

router.delete('/cms/posts/:id', requireFlag('cms'), async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ message: 'Post not found', error: String(error) });
  }
});

export const adminRouter = router;
