import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { OrdersPage } from './orders.page';

export class DashboardPage extends BasePage {
  private readonly myOrdersBtn = this.page.locator('button[routerlink*="myorders"]');

  // Mobile sidebar toggle (based on your DOM)
  private readonly menuCheckbox = this.page.locator('#check');
  private readonly menuLabel = this.page.locator('label[for="check"], label.hamberger-btn');

  constructor(page: Page, private readonly baseUrl: string) {
    super(page);
  }

async goto() {
  await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });

  const sidebar = this.page.locator('app-sidebar');
  const loginTitle = this.page.locator('h1.login-title', { hasText: 'Log in' });

  // Wait for either dashboard shell OR login page (fail fast)
  await Promise.race([
    sidebar.waitFor({ state: 'attached', timeout: 30_000 }),
    loginTitle.waitFor({ state: 'visible', timeout: 30_000 }),
  ]);

  // If login is visible, stop immediately with clear error
  if (await loginTitle.isVisible().catch(() => false)) {
    throw new Error('Still on Login page — token not applied / redirect did not happen.');
  }

  // Now we’re definitely on dashboard; URL wait becomes reliable
  await this.page.waitForURL(/#\/dashboard\/dash/, { timeout: 30_000 });
}



  async openMyOrders(): Promise<OrdersPage> {
    // Ensure sidebar exists first
    await expect(this.page.locator('app-sidebar')).toBeAttached();

    // On mobile portrait, ORDERS lives inside a hamburger sidebar.
    // The checkbox (#check) is usually hidden -> never setChecked() it.
    // Click the visible label (label[for="check"]) to toggle it.
    if (await this.menuLabel.isVisible()) {
      const isOpen = await this.menuCheckbox.isChecked().catch(() => false);

      if (!isOpen) {
        await this.menuLabel.scrollIntoViewIfNeeded();
        await this.menuLabel.click();

        // Optional: confirm menu opened (DOM state flips even if checkbox is hidden)
        await expect(this.menuCheckbox).toBeChecked({ timeout: 2000 }).catch(() => { });
      }
    }

    // Now the ORDERS button should be in the viewport (or at least reachable)
    await expect(this.myOrdersBtn).toBeVisible({ timeout: 10_000 });
    await this.myOrdersBtn.scrollIntoViewIfNeeded();
    await expect(this.myOrdersBtn).toBeInViewport({ timeout: 10_000 });

    await Promise.all([
      this.page.waitForURL(/\/dashboard\/myorders/),
      this.myOrdersBtn.click(),
    ]);

    return new OrdersPage(this.page);
  }

  async verifyProductVisible(productName: string): Promise<boolean> {
    // Wait for products to load
    const productCards = this.page.locator('.card-body');
    await expect(productCards.first()).toBeVisible({ timeout: 10_000 });

    // Get all product titles and check if the desired product is present
    const productTitles = await productCards.locator('h5 > b').allTextContents();
    const isVisible = productTitles.some(title => 
      title.toLowerCase().includes(productName.toLowerCase())
    );

    if (isVisible) {
      // Verify by checking the locator with specific text
      const productLocator = this.page.locator('.card-body', {
        has: this.page.locator(`h5 > b:has-text("${productName}")`)
      });
      await expect(productLocator.first()).toBeVisible();
    }

    return isVisible;
  }
}
