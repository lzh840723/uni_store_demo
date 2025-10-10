import type { PlaywrightTestConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'https://unistoredemo.vercel.app';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL,
    headless: true
  },
  reporter: [['list']]
};

export default config;

