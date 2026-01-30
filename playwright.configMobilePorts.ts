import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 40 * 1000,
  expect: { timeout: 7000 },

  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    headless: isCI ? true : false,
    actionTimeout: 10_000, // ✅ added (max time for each action like click/fill)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // Android / Mobile Chrome-like (Chromium emulation)
    { name: 'Android - Galaxy S24', use: { ...devices['Galaxy S24'] } },
    { name: 'Android - Galaxy A55', use: { ...devices['Galaxy A55'] } },

    // iOS / Mobile Safari (WebKit)
    { name: 'iOS - iPhone 15 (Safari)', use: { ...devices['iPhone 15'] } },
    { name: 'iOS - iPhone SE 3rd gen (Safari)', use: { ...devices['iPhone SE (3rd gen)'] } },

    // Optional tablet
    { name: 'iPad (Safari)', use: { ...devices['iPad (gen 7)'] } },
  ],

});
