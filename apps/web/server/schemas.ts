import { z } from 'zod';

export const productPayloadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().default('USD'),
  images: z.array(z.string().url()).default([])
});

export const postPayloadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  content: z.string(),
  publishedAt: z.coerce.date().optional()
});

export const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'CUSTOMER'])
});
