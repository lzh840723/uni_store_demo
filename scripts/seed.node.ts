#!/usr/bin/env tsx
import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding UniStore demo data...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.post.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: 'admin@unistore.dev',
      name: 'Demo Admin',
      role: Role.ADMIN
    }
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@unistore.dev',
      name: 'Demo Customer',
      role: Role.CUSTOMER
    }
  });

  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'UniStore Logo Hoodie',
        slug: 'unistore-logo-hoodie',
        description: 'Soft fleece hoodie with UniStore branding.',
        priceCents: 6900,
        images: ['https://picsum.photos/seed/unistore-hoodie/600/600']
      }
    }),
    prisma.product.create({
      data: {
        title: 'UniStore Tote Bag',
        slug: 'unistore-tote-bag',
        description: 'Canvas tote for daily essentials.',
        priceCents: 2900,
        images: ['https://picsum.photos/seed/unistore-tote/600/600']
      }
    }),
    prisma.product.create({
      data: {
        title: 'UniStore Coffee Mug',
        slug: 'unistore-coffee-mug',
        description: 'Ceramic mug for your morning brew.',
        priceCents: 1900,
        images: ['https://picsum.photos/seed/unistore-mug/600/600']
      }
    })
  ]);

  const order = await prisma.order.create({
    data: {
      totalCents: products.reduce((sum, product) => sum + product.priceCents, 0),
      customerId: customer.id,
      items: {
        create: products.map((product) => ({
          productId: product.id,
          quantity: 1,
          unitCents: product.priceCents
        }))
      }
    },
    include: { items: true }
  });

  await prisma.post.createMany({
    data: [
      {
        title: '欢迎来到 UniStore',
        slug: 'welcome-to-unistore',
        excerpt: '了解我们的愿景与产品路线。',
        content: 'UniStore 是一个示范性的全渠道电商体验。',
        authorId: admin.id
      },
      {
        title: '季度新品预览',
        slug: 'unistore-season-launch',
        excerpt: '抢先看即将上线的新品。',
        content: '我们将推出多款围绕工作与生活方式的新品。',
        authorId: admin.id
      }
    ]
  });

  console.log('✅ Seed complete', { admin: admin.email, customer: customer.email, order: order.displayId });
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
