import { test, expect } from '@playwright/test';

test('ResolveOps Core Incident Workflow', async ({ page }) => {
  // 1. Customer Login
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@northstar.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Verify Dashboard elements
  await expect(page.locator('text=Welcome back,')).toBeVisible();
  
  // 2. Navigate to failed webhook detail
  await page.click('text=Investigate Failure →');
  await expect(page.locator('text=Webhooks')).toBeVisible();
  
  // Click on whd_2048
  await page.click('text=whd_2048');
  await expect(page.locator('text=Delivery: whd_2048')).toBeVisible();
  
  // 3. Create Ticket with request ID
  await page.click('text=Create Support Request');
  await expect(page.locator('text=Create New Support Request')).toBeVisible();
  
  // Form is pre-filled with req_8bd129c2
  await expect(page.locator('input[value="req_8bd129c2"]')).toBeVisible();
  
  await page.fill('input[placeholder="Brief summary of the issue"]', 'Webhook failure again');
  await page.fill('textarea', 'Need help tracing this issue');
  await page.click('button[type="submit"]');
  
  // Verify ticket created
  await expect(page.locator('text=Webhook failure again')).toBeVisible();
  
  // Sign out
  await page.click('text=Sign out');
  await expect(page.url()).toContain('/login');
  
  // 4. Support Agent Login
  await page.fill('input[type="email"]', 'agent@resolveops.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=Support Dashboard')).toBeVisible({ timeout: 15000 });
  
  // 5. Support Agent Ticket Queue
  await page.click('text=View Ticket Queue →');
  await expect(page.locator('text=Ticket Queue')).toBeVisible();
  await page.click('text=Webhook failure again');
  
  // 6. Trace Explorer
  await expect(page.locator('text=req_8bd129c2')).toBeVisible();
  await page.click('a:has-text("req_8bd129c2")'); // Click trace link
  
  await expect(page.locator('text=Trace: req_8bd129c2')).toBeVisible();
  await expect(page.locator('text=WEBHOOK_SIGNATURE_INVALID')).toBeVisible();
  
  // 7. Test passes if all links are functional and the flow works
  expect(true).toBeTruthy();
});
