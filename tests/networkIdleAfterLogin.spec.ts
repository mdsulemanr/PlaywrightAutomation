import { test, Browser, expect } from '@playwright/test'; // test annotation

test('Browser Playwright fixture', async ({ browser }) => {
  // browser fixture exists here with proper type Browser

  const context = await browser.newContext(); // create a new browser context
  const page = await context.newPage(); // create a new page in the context

  const BASE_URL = 'https://rahulshettyacademy.com/client/';
  const EMAIL_ADDRESS = 'testuser01@example.com';
  const PASSWORD = 'StrongPass123!';


  const username = page.locator('#userEmail');
  const password = page.locator('#userPassword');
  const signInBtnId = page.locator('#login');

  await page.goto(BASE_URL);
  await username.fill(EMAIL_ADDRESS);
  await password.fill(PASSWORD);
  await signInBtnId.click();

  // If we immediately try to grab and print all prroducts, it can retrieve empty list because empty list it not an error
  const productTitles = await page.locator('.card-body > h5 > b').allTextContents();  
  console.log(productTitles);

  // When the web page is redering, so many api calls are made in the background to fetch data.
  // https://rahulshettyacademy.com/api/ecom/product/get-all-products

  // because products may take time to load after login. So we need to wait for products to be visible.
  // Instead of putting hard sleep, we can make use of waitforload('networkidle').
  // As displaying of all products on web page depends on api call to be completed.

  await page.waitForLoadState('networkidle');

  const updatedProductTitles = await page.locator('.card-body > h5 > b').allTextContents();
  console.log(updatedProductTitles);

  // Using await page.waitForLoadState('networkidle'); might not be sufficient in some cases where specific element takes more time to load.
  await page.locator('.card-body > h5 > b').first().waitFor(); // wait for first product to be visible
  const finalProductTitles = await page.locator('.card-body > h5 > b').allTextContents();
  console.log(finalProductTitles);

});
