import { test, Browser, expect } from '@playwright/test'; // test annotation

test('Browser Playwright fixture', async ({ browser }) => {
  // browser fixture exists here with proper type Browser

  const context = await browser.newContext(); // create a new browser context
  const page = await context.newPage(); // create a new page in the context

  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const title =  await page.title();
  console.log(title);
  await expect(page).toHaveTitle(title);

  await page.locator('#username').fill('rahulshettyacademy');
  await page.locator('#password').fill('learning');
  await page.locator('#signInBtn').click();
});

// without using browser fixture, page fixture can be used directly and it will create browser and context internally
test('Page Playwright fixture', async ({ page }) => {
  // page fixture exists here with proper type Page

  await page.goto('https://google.com');
  const title =  await page.title();
  console.log(title);
  await expect(page).toHaveTitle(title);
});

// there are other fixtures like context, request and electronApp available in Playwright Test