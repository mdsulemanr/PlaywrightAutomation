import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  // Keep test timeout slightly higher for slower CI
  timeout: 40 * 1000,

  expect: { timeout: 7000 },

  fullyParallel: true,
  forbidOnly: isCI,
  // retries: isCI ? 2 : 0,
  // above work on CI only, below works everywhere
  retries: 1,
  workers: isCI ? 1 : undefined,

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // CI should generally be headless; local can be headed
    headless: isCI ? true : false,
    // Ignore HTTPS errors (useful for self-signed certs)
    ignoreHTTPSErrors: true,
    // Allow geolocation (useful for location-based tests)
    permissions: ['geolocation'],
    // Better defaults: less noise than screenshot:'on'
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // If you have a stable base url, set it once
    // baseURL: 'https://rahulshettyacademy.com/client/',
  },

  projects: [
    // ---------- Desktop ----------
    {
      name: 'Desktop Chrome (Chromium)',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari (WebKit)',
      use: { ...devices['Desktop Safari'] },
    },

    // ---------- Branded Desktop ----------
    {
      name: 'Microsoft Edge (Chromium)',
      use: {
        ...devices['Desktop Edge'],
        browserName: 'chromium',
        channel: 'msedge',
      },
    },
    {
      name: 'Google Chrome (Chromium)',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        channel: 'chrome',
      },
    },

    // ---------- Mobile Emulation ----------
    // Android-style mobile in Chromium
    {
      name: 'Mobile Chrome - Pixel 5',
      use: { ...devices['Pixel 5'] },
    },

    // iOS Safari in WebKit
    {
      name: 'Mobile Safari - iPhone 12',
      use: { ...devices['iPhone 12'] },
    },

    // Optional: tablet coverage
    {
      name: 'Tablet - iPad (gen 7)',
      use: { ...devices['iPad (gen 7)'] },
    },
  ],
});


