// End-to-end test config (M22.03). Run: npm run e2e   ·   UI mode: npm run e2e -- --ui
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/app/modules',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false, // the tests share one fake API; keep them sequential
  retries: process.env['CI'] ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
