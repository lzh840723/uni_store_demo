import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireFlag } from '../middleware/featureFlagGuard.js';

const router = express.Router();

const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0)
});

router.get('/products', requireFlag('commerce'), async (req, res) => {
  const { limit, offset } = paginationSchema.parse(req.query);

  const [items, count] = await Promise.all([
    prisma.product.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count()
  ]);

  return res.json({ items, count, limit, offset });
});

router.get('/products/:idOrSlug', requireFlag('commerce'), async (req, res) => {
  const { idOrSlug } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }]
    }
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json(product);
});

router.post('/cart', requireFlag('commerce'), async (_req, res) => {
  const cart = await prisma.cart.create({
    data: {}
  });

  return res.status(201).json({ cartId: cart.id, items: [], totalCents: cart.totalCents });
});

const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive()
});

router.post('/cart/:cartId/items', requireFlag('commerce'), async (req, res) => {
  const { cartId } = req.params;
  const parsed = addItemSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
  }

  const cart = await prisma.cart.findUnique({ where: { id: cartId }, include: { items: true } });
  if (!cart || cart.status !== 'OPEN') {
    return res.status(404).json({ message: 'Cart not found or closed' });
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingItem = cart.items.find((item) => item.productId === product.id);

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + parsed.data.quantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId,
        productId: product.id,
        quantity: parsed.data.quantity
      }
    });
  }

  const updatedItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: { product: true }
  });

  const totalCents = updatedItems.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);

  const updatedCart = await prisma.cart.update({
    where: { id: cartId },
    data: { totalCents },
    include: { items: { include: { product: true } } }
  });

  return res.json(updatedCart);
});

router.get('/cart/:cartId', requireFlag('commerce'), async (req, res) => {
  const { cartId } = req.params;
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } }
  });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  return res.json(cart);
});

const checkoutSchema = z.object({
  cartId: z.string(),
  customerEmail: z.string().email().optional()
});

router.post('/checkout', requireFlag('commerce'), async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
  }

  const cart = await prisma.cart.findUnique({
    where: { id: parsed.data.cartId },
    include: { items: { include: { product: true } } }
  });

  if (!cart || cart.status !== 'OPEN') {
    return res.status(404).json({ message: 'Cart not found or closed' });
  }

  if (cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const customer = parsed.data.customerEmail
    ? await prisma.user.upsert({
        where: { email: parsed.data.customerEmail },
        create: { email: parsed.data.customerEmail, role: 'CUSTOMER' },
        update: {}
      })
    : undefined;

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        totalCents: cart.totalCents,
        customerId: customer?.id
      }
    });

    await Promise.all(
      cart.items.map((item) =>
        tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitCents: item.product.priceCents,
            currency: item.product.currency
          }
        })
      )
    );

    await tx.cart.update({
      where: { id: cart.id },
      data: { status: 'COMPLETED' }
    });

    return createdOrder;
  });

  return res.status(201).json({
    orderId: order.id,
    orderNumber: order.displayId,
    totalCents: order.totalCents,
    currency: order.currency,
    createdAt: order.createdAt
  });
});

router.get('/orders/:orderId', requireFlag('commerce'), async (req, res) => {
  const { orderId } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, customer: true }
  });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return res.json(order);
});

export const storeRouter = router;
