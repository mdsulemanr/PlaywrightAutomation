import { test, expect, request } from '@playwright/test';

const BASE_URL = 'https://rahulshettyacademy.com/client/';
const CART_URL = 'https://rahulshettyacademy.com/client/#/dashboard/cart';

let webContext: any;

test.beforeAll( async ({browser}) => {

  const context = await browser.newContext(); // create a new browser context
  const page = await context.newPage(); // create a new page in the context

  const EMAIL_ADDRESS = 'testertesty@gmail.com';
  const PASSWORD = 'Testertesty!1';
  const usernameId = '#userEmail';
  const passwordId = '#userPassword';
  const loginBtnId = '#login';

  const username = page.locator(usernameId);
  const password = page.locator(passwordId);
  const signInBtnId = page.locator(loginBtnId);

  await page.goto(BASE_URL);
  await username.fill(EMAIL_ADDRESS);
  await password.fill(PASSWORD);
  await signInBtnId.click();
  // Wait for navigation to dashboard after login
  // This is important to ensure that the session storage is fully populated
  await page.locator(".card-body b").first().waitFor();
  await context.storageState({path: 'loginSessionStorage.json'});
  webContext = await browser.newContext({storageState: 'loginSessionStorage.json'});

});


test('End-to-end Testing', async () => {

  const EMAIL_ADDRESS = 'testertesty@gmail.com';
  const productName = 'iphone 13 pro';
  const addToCartBtn = 'Add To Cart';
  const allProductCardsSelector = '.card-body';
  const productTitleSelector = 'h5 > b';
  const cartBtnSelector = '[routerlink*="cart"]';

  const page = await webContext.newPage();
  await page.goto(BASE_URL);

  const allProductsTitleLocator = page.locator(allProductCardsSelector);
  const productTitleLocator = allProductsTitleLocator.locator(productTitleSelector);


  // Using await page.waitForLoadState('networkidle'); might not be sufficient in some cases where specific element takes more time to load.
  await allProductsTitleLocator.first().waitFor(); // wait for first product to be visible
  const finalProductTitles = await productTitleLocator.allTextContents();
  console.log(finalProductTitles);

  const productCount = await productTitleLocator.count();
  console.log(`Total products found: ${productCount}`);

  // Iterate through products to find the desired product
  for (let i = 0; i < productCount; i++) {
    const title = await productTitleLocator.nth(i).textContent();
    if (title === productName) {
      console.log(`Found the product: ${title}`);
      console.log(`Comparing ${title} with ${productName}`);

      // Click on Add to Cart button for the matched product
      await allProductsTitleLocator.nth(i).locator(`button:has-text("${addToCartBtn}")`).click();
      break;
      }
  }

  // Another approach using locator filtering
  // const desiredProduct = allProductsTitleLocator.filter({ hasText: productName });
  // await desiredProduct.locator(`button:has-text("${addToCartBtn}")`).click();

  // await page.waitForTimeout(3000); // just to visually see the product added to cart before navigating to cart page
  await page.locator(cartBtnSelector).click();
  // Another way to wait for navigation to cart page
  // await page.getByRole('listitem').getByRole('button', { name: 'Cart' }).click();


  await page.waitForURL(CART_URL);
  await page.locator('.cart li .cartSection').first().waitFor(); // wait for cart items to be visible
  const cartProductName = page.locator(`h3:has-text("${productName}")`);
  const isProductInCart = await cartProductName.isVisible(); // Returns boolean
  expect(isProductInCart).toBeTruthy();
  // Another way to assert product is in cart
  // const cartProductName = page.getByText(productName);
  // await expect(cartProductName).toBeVisible();

  
  await page.locator('text=Checkout').click();
  // Another way to wait for navigation to checkout page
  // await page.getByRole('button', { name: 'Checkout' }).click();
  // await page.waitForTimeout(3000); // wait to visually verify checkout page


  await page.locator('input[placeholder="Select Country"]').pressSequentially('ind', { delay: 150 });
  // Alternate locators for country selection input
  // await page.getByPlaceholder('Select Country').pressSequentially('ind', { delay: 150 });
  // await page.getByRole('textbox', { name: 'Select Country' }).pressSequentially('ind', { delay: 150 });

  await page.locator('section[class*="results"]').waitFor(); // wait for results to be visible

  await page.getByText('Indonesia', { exact: true }).click();
  // Alternate locators for selecting 'Indonesia' from results
  // await page.getByRole('option', { name: 'Indonesia' }).click();

  // await page.waitForTimeout(3000); // wait to visually verify country selection
  const emailText = page.locator(`label[type="text"]`);
  expect(emailText).toHaveText(EMAIL_ADDRESS);
  const placeHolderBtn = page.locator('.btnn.action__submit');
  await placeHolderBtn.click();
  const orderConfirmationMsgLocator = page.locator('.hero-primary');
  // Another way to locate order confirmation message
  // const orderConfirmationMsgLocator = page.getByText(' Thankyou for the order. ');

  await expect(orderConfirmationMsgLocator).toBeVisible();
  await expect(orderConfirmationMsgLocator).toHaveText(' Thankyou for the order. ');

  // Capture the order ID for future reference
  const orderIdLocator = page.locator('.em-spacer-1 .ng-star-inserted');
  const orderId = (await orderIdLocator.textContent() ?? '');
  console.log(`Order ID: ${orderId}`);

  // Navigate to 'My Orders' page to verify the order is listed there
  const ordersBtn = page.locator('button[routerlink*="myorders"]');
  await ordersBtn.click();
  await page.waitForLoadState('networkidle');
  await page.locator('tbody tr').first().waitFor(); // wait for orders table to be visible
  const allOrderRows = page.locator('tbody tr');
  const rowCount = await allOrderRows.count();

  // Find the order by order ID and click 'View' button
  for (let i = 0; i < rowCount; i++) {
    const rowOrderId = (await allOrderRows.nth(i).locator('th').textContent() ?? '');
    if (orderId.includes(rowOrderId)) {
      await allOrderRows.nth(i).locator('button:has-text("View")').click();
      console.log(`Order with ID: ${orderId} found and View button clicked.`);
      break;
    }
    if (i === rowCount - 1) {
      throw new Error(`Order with ID: ${orderId} not found in My Orders.`);
    }
  }

  const orderDetailsIdLocator = page.locator('.col-text');
  const orderDetailsId = (await orderDetailsIdLocator.textContent() ?? '');
  expect(orderId.includes(orderDetailsId)).toBeTruthy();

  await page.waitForTimeout(3000); // wait to visually verify order confirmation



});