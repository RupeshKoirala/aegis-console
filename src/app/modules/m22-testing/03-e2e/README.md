# M22.03 · End-to-end tests with Playwright  ⏱ 60 min

Unit tests prove the pieces work. **E2E tests prove the product works**: a real browser, the real app, the (fake) API, clicking like an analyst. They're slower and flakier, so keep a **few** of them, on the critical journeys: block an IP, role checks, URL-shareable filters.

```ts
test('an analyst blocks a new IP', async ({ page }) => {
  await page.goto('/m12/03');
  await page.getByPlaceholder('IP, CIDR or domain').fill('203.0.113.201');
  await page.getByRole('button', { name: 'Block' }).click();
  await expect(page.locator('li', { hasText: '203.0.113.201' })).toBeVisible();   // auto-waits and retries
});
```
- **Locators by role/label/placeholder** (what users see) survive refactors and double as an accessibility check.
- `expect(...)` **retries** until a timeout, so there are no `sleep(2000)`s. A sleep in an e2e test is a bug.
- `playwright.config.ts` (repo root) starts `npm start` for you (`webServer`) and points `baseURL` at it.

## Your tasks: `console.e2e.ts` TODO 0–4
`npx playwright install chromium` once, then `npm run e2e`. Change `test.fixme` to `test` as you go.

## Senior notes
- **Isolate data.** Every test resets the DB (`POST /__reset`, a test-only endpoint of the fake API). Shared state between e2e tests is the #1 cause of flakiness.
- In CI: `retries: 2`, `trace: 'on-first-retry'`, and upload `playwright-report/` as an artifact. The trace viewer shows DOM, network and console at every step.
- Don't e2e-test what a unit test covers (validation messages, formatting). E2E covers wiring: routing + HTTP + auth + rendering together.
- **Gen 1:** Protractor (deprecated in v12, removed in v15) with WebDriver and `browser.waitForAngular()`. **Gen 2:** Cypress / Playwright via community builders. **Gen 3:** Playwright is the common default, `ng e2e` integrates it, and Angular CDK harnesses can drive Playwright pages too.
