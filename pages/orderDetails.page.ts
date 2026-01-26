import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class OrderDetailsPage extends BasePage {
  private readonly orderIdText = this.page.locator('.col-text');

  constructor(page: Page) {
    super(page);
  }

  async getDisplayedOrderId(): Promise<string> {
    await expect(this.orderIdText).toBeVisible();
    return (await this.orderIdText.textContent())?.trim() ?? '';
  }
}
