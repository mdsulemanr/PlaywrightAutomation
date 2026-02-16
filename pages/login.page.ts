import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { DashboardPage } from './dashboard.page';

export class LoginPage extends BasePage {
  private readonly emailInput = this.page.locator('#userEmail');
  private readonly passwordInput = this.page.locator('#userPassword');
  private readonly loginButton = this.page.locator('#login');
  private readonly rememberMeCheckbox = this.page.locator('input[type="checkbox"]').first();

  constructor(page: Page, private readonly baseUrl: string) {
    super(page);
  }

  async goto() {
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
    // Wait for login form to be visible
    await expect(this.emailInput).toBeVisible({ timeout: 10_000 });
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async tickRememberMeCheckbox() {
    // Check if checkbox is visible before attempting to click
    if (await this.rememberMeCheckbox.isVisible().catch(() => false)) {
      const isChecked = await this.rememberMeCheckbox.isChecked().catch(() => false);
      if (!isChecked) {
        await this.rememberMeCheckbox.click();
        await expect(this.rememberMeCheckbox).toBeChecked({ timeout: 5_000 });
      }
    }
  }

  async clickLogin(): Promise<DashboardPage> {
    await Promise.all([
      this.page.waitForURL(/#\/dashboard\/dash/, { timeout: 30_000 }),
      this.loginButton.click(),
    ]);
    return new DashboardPage(this.page, this.baseUrl);
  }
}
