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
        title: 'Welcome to UniStore',
        slug: 'welcome-to-unistore',
        excerpt: 'Learn about the UniStore vision and roadmap.',
        content: 'UniStore is a showcase for an omnichannel commerce experience.',
        authorId: admin.id
      },
      {
        title: 'Seasonal Launch Preview',
        slug: 'unistore-season-launch',
        excerpt: 'Get a sneak peek at the products arriving soon.',
        content: 'We are preparing a new drop focused on work and lifestyle essentials.',
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
