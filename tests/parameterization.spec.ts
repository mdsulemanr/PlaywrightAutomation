import { test, expect } from '@playwright/test'; // test annotation
import {customtest} from './utils/test-base';

// Import test data from JSON file
// JSON.parse(JSON.stringify(require('./utils/testData.json'))) first converts to string and then back to JSON to avoid caching issues
const testData = JSON.parse(JSON.stringify(require('./utils/testData.json')));

// Parameterized tests using data from JSON
for (const dataSet of testData) {
  test(`Login test with username: ${dataSet.username} and password: ${dataSet.password}`, async ({ browser }) => {

    const context = await browser.newContext(); // create a new browser context
    const page = await context.newPage(); // create a new page in the context

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const title = await page.title();
    console.log(title);
    await expect(page).toHaveTitle(title);

    await page.locator('#username').fill(dataSet.username);
    await page.locator('#password').fill(dataSet.password);
    await page.locator('#signInBtn').click();
  });

}

// Example of using customTest with shared fixtures
customtest.only('Login test using customTest with shared fixtures', async ({ page }) => {
  const data = testData[0]; // Use the first test data set
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const title = await page.title();
  console.log(title);
  await expect(page).toHaveTitle(title);
  await page.locator('#username').fill(data.username);
  await page.locator('#password').fill(data.password);
  await page.locator('#signInBtn').click();
});