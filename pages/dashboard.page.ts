import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { OrdersPage } from './orders.page';

export class DashboardPage extends BasePage {
  private readonly myOrdersBtn = this.page.locator('button[routerlink*="myorders"]');

  constructor(page: Page, private readonly baseUrl: string) {
    super(page);
  }

  async goto() {
    await this.page.goto(this.baseUrl);
    // a light sanity check that page loaded enough to interact
    await expect(this.myOrdersBtn).toBeVisible();
  }

  async openMyOrders(): Promise<OrdersPage> {
    await this.myOrdersBtn.click();
    return new OrdersPage(this.page);
  }
}
