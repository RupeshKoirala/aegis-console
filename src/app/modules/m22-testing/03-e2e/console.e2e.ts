// End-to-end tests: a REAL browser against the REAL app (ng serve) and the fake API. Run: npm run e2e
// Playwright docs: https://playwright.dev/docs/writing-tests
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  // Each test starts from a known database: never let e2e tests depend on each other.
  await request.post('http://localhost:3000/__reset');
});

test('an analyst blocks a new IP and removes it again', async ({ page }) => {
  await page.goto('/m12/03');
  await page.getByPlaceholder('IP, CIDR or domain').fill('203.0.113.201');
  await page.getByPlaceholder('why?').fill('e2e: C2 beacon');
  await page.getByRole('button', { name: 'Block' }).click();
  const row = page.locator('li', { hasText: '203.0.113.201' });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Remove' }).click();
  await expect(row).toHaveCount(0);
});

test('a duplicate shows the server\'s problem detail', async ({ page }) => {
  await page.goto('/m12/03');
  await page.getByPlaceholder('IP, CIDR or domain').fill('203.0.113.7');
  await page.getByRole('button', { name: 'Block' }).click();
  await expect(page.getByRole('alert')).toHaveText('203.0.113.7 is already on this list');
});

test('a read-only viewer is bounced from the users page', async ({ page }) => {
  await page.goto('/m15/03/console/users');
  await expect(page).toHaveURL(/\/m15\/03\/login\?returnUrl=/);
  await page.locator('aegis-login-box select').selectOption('viewer@acme.test');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/m15\/03\/forbidden$/);
});

test('filters live in the URL', async ({ page }) => {
  await page.goto('/m14/03/lists/3/indicators?q=phish');
  await expect(page.locator('li .mono')).toHaveText(['203.0.113.120', 'login-micr0soft.example']);
  await page.getByPlaceholder('filter…').fill('brute');
  await expect(page).toHaveURL(/q=brute/);
});
