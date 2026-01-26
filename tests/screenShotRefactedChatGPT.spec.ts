// Avoid any
// Use Page and Locator types from Playwright.

// Use Playwright assertions on the Page
// Prefer await expect(page).toHaveTitle(...) (auto-waits) instead of manually reading title.

// Don’t waitForResponse() for navigation unless you truly need that API call
// After clicking Sign In, the intent is “page navigated / dashboard loaded”, so use:

// Promise.all([page.waitForURL(...), click]), or

// expect(page).toHaveURL(...), or

// a visible dashboard locator.

// Screenshots: don’t hardcode filenames
// In parallel runs, files can overwrite. Use testInfo.outputPath(...).

// Make fields readonly and keep constants static
// Cleaner and safer.

import { test, expect, type Page, type Locator } from '@playwright/test';

class LoginPage {
  private readonly page: Page;

  // Prefer putting baseURL in playwright.config.ts, but keeping it here since you're learning.
  private readonly BASE_URL = 'https://rahulshettyacademy.com';

  static readonly LOGIN_PAGE_EXPECTED_TITLE = 'LoginPage Practise | Rahul Shetty Academy';
  static readonly DASHBOARD_PAGE_EXPECTED_TITLE = 'ProtoCommerce';

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly formControl: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('#signInBtn');
    this.formControl = page.locator('select.form-control');
  }

  async navigateToLogin() {
    await this.page.goto(`${this.BASE_URL}/loginpagePractise/`);
    await expect(this.page).toHaveTitle(LoginPage.LOGIN_PAGE_EXPECTED_TITLE);
  }

  async fillCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async signInAndWaitForDashboard() {
    // More stable than waiting for a specific network response
    await Promise.all([
      this.page.waitForURL(/angularpractice/i), // dashboard app route
      this.signInButton.click(),
    ]);

    await expect(this.page).toHaveTitle(LoginPage.DASHBOARD_PAGE_EXPECTED_TITLE);
  }

  async takeLoginScreenshots(testInfo: any) {
    await this.page.screenshot({ path: testInfo.outputPath('loginPage.png') });
    await this.formControl.screenshot({ path: testInfo.outputPath('formControl.png') });
  }

  async takeDashboardScreenshot(testInfo: any) {
    await this.page.screenshot({ path: testInfo.outputPath('dashboardPage.png'), fullPage: true });
  }
}

test('Browser Playwright fixture', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);

  await test.step('Open login page + verify title', async () => {
    await loginPage.navigateToLogin();
  });

  await test.step('Capture login screenshots', async () => {
    await loginPage.takeLoginScreenshots(testInfo);
  });

  await test.step('Login and wait for dashboard', async () => {
    await loginPage.fillCredentials('rahulshettyacademy', 'Learning@830$3mK2');
    await loginPage.signInAndWaitForDashboard();
  });

  await test.step('Capture dashboard screenshot', async () => {
    await loginPage.takeDashboardScreenshot(testInfo);
  });
});
