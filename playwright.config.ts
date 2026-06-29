import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL: 'http://localhost:4321',
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: false,
    timeout: 30000,
  },
  projects: [
    {
      name: 'Desktop - Dark',
      use: {
        viewport: { width: 1440, height: 900 },
        colorScheme: 'dark',
      },
    },
    {
      name: 'Desktop - Light',
      use: {
        viewport: { width: 1440, height: 900 },
        colorScheme: 'light',
      },
    },
    {
      name: 'Mobile - Dark',
      use: {
        viewport: { width: 375, height: 812 },
        colorScheme: 'dark',
      },
    },
  ],
});
