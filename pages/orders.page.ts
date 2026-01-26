import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class OrdersPage extends BasePage {
  private readonly rows = this.page.locator('tbody tr');

  constructor(page: Page) {
    super(page);
  }

  async openOrderById(orderId: string) {
    await expect(this.rows.first()).toBeVisible();

    const count = await this.rows.count();
    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      const rowOrderId = (await row.locator('th').textContent())?.trim() ?? '';

      if (orderId.includes(rowOrderId)) {
        await row.locator('button:has-text("View")').click();
        return;
      }
    }

    throw new Error(`Order with ID: ${orderId} not found in My Orders.`);
  }
}
