import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await page.getByRole('searchbox', { name: 'Search Wikipedia' }).fill('list of countries');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('link', { name: 'United Nations member' }).click();
  await page.getByRole('link', { name: 'Member states of the League' }).first().click();
});