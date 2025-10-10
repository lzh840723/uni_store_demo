import { test, expect } from '@playwright/test';

test.describe('Admin analytics', () => {
  test('loads 7-day chart for ADMIN', async ({ page, context, baseURL }) => {
    await page.goto('/');
    // Set role cookie to ADMIN then navigate
    await context.addCookies([{ name: 'role', value: 'ADMIN', url: baseURL! }]);
    await page.goto('/admin/analytics');
    await expect(page.getByRole('heading', { name: /Orders & GMV \(last 7 days\)/ })).toBeVisible();
    await expect(page.getByText('GMV ($)')).toBeVisible();
  });
});

