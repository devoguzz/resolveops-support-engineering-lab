import { test, expect } from '@playwright/test';

test.describe('Customer Portal Viewport Checks', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport

  test('Lists adapt to mobile viewport', async ({ page }) => {
    // 1. Customer Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'owner@northstar.demo');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Verify Dashboard loads and is visible
    await expect(page.getByText('Welcome back', { exact: false })).toBeVisible();

    // Go to support requests
    await page.goto('/app/support');
    await page.waitForTimeout(2000);

    // Go to Webhooks
    await page.goto('/app/webhooks');
    await page.waitForTimeout(2000);
    await expect(page.locator('.overflow-x-auto').first()).toBeVisible();

    // Test responsive grid on dashboard
    await page.getByText('Dashboard', { exact: true }).first().click();
    const dashboardCards = page.locator('.grid').first();
    await expect(dashboardCards).toBeVisible();
  });
});
