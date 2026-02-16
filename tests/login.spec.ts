import { test, Browser, expect } from '@playwright/test'; // test annotation

test.only('Browser Playwright fixture', async ({ browser }) => {
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
