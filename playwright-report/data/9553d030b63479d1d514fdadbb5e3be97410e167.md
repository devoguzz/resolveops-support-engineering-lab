# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> ResolveOps Core Incident Workflow
- Location: e2e\smoke.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Support Dashboard')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('text=Support Dashboard')

```

```yaml
- heading "System Forbidden" [level=2]
- paragraph: Not implemented yet.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('ResolveOps Core Incident Workflow', async ({ page }) => {
  4  |   // 1. Customer Login
  5  |   await page.goto('/login');
  6  |   await page.fill('input[type="email"]', 'admin@northstar.test');
  7  |   await page.fill('input[type="password"]', 'password123');
  8  |   await page.click('button[type="submit"]');
  9  |   
  10 |   // Verify Dashboard elements
  11 |   await expect(page.locator('text=Welcome back,')).toBeVisible();
  12 |   
  13 |   // 2. Navigate to failed webhook detail
  14 |   await page.click('text=Investigate Failure →');
  15 |   await expect(page.locator('text=Webhooks')).toBeVisible();
  16 |   
  17 |   // Click on whd_2048
  18 |   await page.click('text=whd_2048');
  19 |   await expect(page.locator('text=Delivery: whd_2048')).toBeVisible();
  20 |   
  21 |   // 3. Create Ticket with request ID
  22 |   await page.click('text=Create Support Request');
  23 |   await expect(page.locator('text=Create New Support Request')).toBeVisible();
  24 |   
  25 |   // Form is pre-filled with req_8bd129c2
  26 |   await expect(page.locator('input[value="req_8bd129c2"]')).toBeVisible();
  27 |   
  28 |   await page.fill('input[placeholder="Brief summary of the issue"]', 'Webhook failure again');
  29 |   await page.fill('textarea', 'Need help tracing this issue');
  30 |   await page.click('button[type="submit"]');
  31 |   
  32 |   // Verify ticket created
  33 |   await expect(page.locator('text=Webhook failure again')).toBeVisible();
  34 |   
  35 |   // Sign out
  36 |   await page.click('text=Sign out');
  37 |   await expect(page.url()).toContain('/login');
  38 |   
  39 |   // 4. Support Agent Login
  40 |   await page.fill('input[type="email"]', 'agent@resolveops.test');
  41 |   await page.fill('input[type="password"]', 'password123');
  42 |   await page.click('button[type="submit"]');
  43 |   
> 44 |   await expect(page.locator('text=Support Dashboard')).toBeVisible({ timeout: 15000 });
     |                                                        ^ Error: expect(locator).toBeVisible() failed
  45 |   
  46 |   // 5. Support Agent Ticket Queue
  47 |   await page.click('text=View Ticket Queue →');
  48 |   await expect(page.locator('text=Ticket Queue')).toBeVisible();
  49 |   await page.click('text=Webhook failure again');
  50 |   
  51 |   // 6. Trace Explorer
  52 |   await expect(page.locator('text=req_8bd129c2')).toBeVisible();
  53 |   await page.click('a:has-text("req_8bd129c2")'); // Click trace link
  54 |   
  55 |   await expect(page.locator('text=Trace: req_8bd129c2')).toBeVisible();
  56 |   await expect(page.locator('text=WEBHOOK_SIGNATURE_INVALID')).toBeVisible();
  57 |   
  58 |   // 7. Test passes if all links are functional and the flow works
  59 |   expect(true).toBeTruthy();
  60 | });
  61 | 
```