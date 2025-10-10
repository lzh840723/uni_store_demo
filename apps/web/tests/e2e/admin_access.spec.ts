import { test, expect } from '@playwright/test';

test.describe('Admin access guards', () => {
  test('Home page shows Admin card disabled for CUSTOMER', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    // Admin card should show role hint when not ADMIN
    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();
    await expect(page.getByText('Role: Admin only')).toBeVisible();
  });

  test('Direct /admin redirects to /403 for CUSTOMER', async ({ page }) => {
    await page.context().clearCookies();
    const response = await page.goto('/admin');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/403$/);
    await expect(page.getByRole('heading', { name: '403' })).toBeVisible();
  });
});

