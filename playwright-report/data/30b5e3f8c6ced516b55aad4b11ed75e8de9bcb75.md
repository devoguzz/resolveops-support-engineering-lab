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

Locator: locator('text=Create New Support Request')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Create New Support Request')

```

```yaml
- complementary:
  - text: ResolveOps
  - navigation:
    - paragraph: Workspace
    - link "Dashboard":
      - /url: /app
    - link "Tickets":
      - /url: /app/support
    - link "Webhook Deliveries":
      - /url: /app/webhooks
    - link "Integrations":
      - /url: /app/integrations
    - link "API Keys":
      - /url: /app/api-keys
    - link "Team":
      - /url: /app/team
    - link "Activity Log":
      - /url: /app/activity
    - link "Subscription":
      - /url: /app/subscription
  - text: J
  - paragraph: Jane Doe
  - paragraph: owner
  - button "Reset Demo"
  - button "Sign Out"
- banner:
  - button
- heading "Create Support Request" [level=1]
- paragraph: Submit a new technical support request to our engineering team.
- text: Subject
- textbox "Brief summary of the issue"
- text: Description
- textbox "Provide as much detail as possible..."
- text: Request ID (Optional)
- textbox [disabled]: req_8bd129c2
- paragraph: If this request is related to a specific API or Webhook request, its ID will appear here.
- button "Cancel"
- button "Submit Request"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('ResolveOps Core Incident Workflow', async ({ page }) => {
  4  |   // 1. Customer Login
  5  |   await page.goto('/login');
  6  |   await page.fill('input[type="email"]', 'owner@northstar.demo');
  7  |   await page.fill('input[type="password"]', 'password123');
  8  |   await page.click('button[type="submit"]');
  9  |   
  10 |   // Verify Dashboard elements
  11 |   await expect(page.getByText('Welcome back', { exact: false })).toBeVisible();
  12 |   
  13 |   // 2. Navigate to failed webhook detail
  14 |   await page.goto('/app/webhooks');
  15 |   await page.waitForTimeout(2000);
  16 |   
  17 |   // Click on whd_2048
  18 |   await page.getByText('whd_2048').first().click();
  19 |   await expect(page.locator('text=Delivery: whd_2048')).toBeVisible();
  20 |   
  21 |   // 3. Create Ticket with request ID
  22 |   await page.getByText('Create Support Request').click();
> 23 |   await expect(page.locator('text=Create New Support Request')).toBeVisible();
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
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
  36 |   await page.getByText('Sign out', { exact: false }).click();
  37 |   await expect(page.url()).toContain('/login');
  38 |   
  39 |   // 4. Support Agent Login
  40 |   await page.fill('input[type="email"]', 'maya@resolveops.demo');
  41 |   await page.fill('input[type="password"]', 'password123');
  42 |   await page.click('button[type="submit"]');
  43 |   
  44 |   await expect(page.locator('text=Support Dashboard')).toBeVisible({ timeout: 15000 });
  45 |   
  46 |   // 5. Support Agent Ticket Queue
  47 |   await page.goto('/app/support');
  48 |   await page.waitForTimeout(2000);
  49 |   await page.getByText('Webhook failure again').click();
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