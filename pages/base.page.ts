import type { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}
