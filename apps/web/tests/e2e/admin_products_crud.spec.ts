import { test, expect } from '@playwright/test';

const allowWrite = process.env.E2E_ALLOW_ADMIN_WRITE === 'true';

test.describe('Admin products CRUD (gated)', () => {
  test.skip(!allowWrite, 'Set E2E_ALLOW_ADMIN_WRITE=true to enable write tests');

  test('create and delete product', async ({ page, context, baseURL }) => {
    const suffix = Date.now().toString().slice(-6);
    const title = `Auto E2E Product ${suffix}`;
    const slug = `auto-e2e-${suffix}`;

    await page.goto('/');
    await context.addCookies([{ name: 'role', value: 'ADMIN', url: baseURL! }]);

    await page.goto('/admin/products');
    await page.getByLabel('Title').fill(title);
    await page.getByLabel('Slug').fill(slug);
    await page.getByLabel('Price (cents)').fill('1234');
    await page.getByRole('button', { name: 'Create product' }).click();

    await expect(page.getByText(title)).toBeVisible();

    // Delete the created product to keep env clean
    const row = page.locator('tr', { hasText: title });
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(title)).toHaveCount(0);
  });
});

