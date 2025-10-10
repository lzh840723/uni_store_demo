import { test, expect } from '@playwright/test';

const allowCheckout = process.env.E2E_ALLOW_CHECKOUT === 'true';

test.describe('Storefront checkout (gated)', () => {
  test.skip(!allowCheckout, 'Set E2E_ALLOW_CHECKOUT=true to enable checkout test');

  test('buy first product end-to-end', async ({ page }) => {
    await page.goto('/store');
    // Click first product card
    const firstCard = page.locator('a.surface').first();
    await firstCard.click();

    // Product detail -> add to cart
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.getByRole('button', { name: /Processing|Add to cart/ })).toBeVisible();

    // Go to checkout and submit
    await page.goto('/store/checkout');
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    await page.getByRole('button', { name: 'Complete demo checkout' }).click();

    await expect(page.getByRole('heading', { name: 'Order confirmation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Continue shopping' })).toBeVisible();
  });
});

