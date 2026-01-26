import { test, expect, request } from '@playwright/test';
import { APIUtils } from './utils/apiUtils';

const BASE_URL = 'https://rahulshettyacademy.com/client/';

let token: string;
let orderID: string;


test.beforeAll( async () => {

    // Request context created before all tests
    const apiContext = await request.newContext();
    // Create an instance of APIUtils with the request context
    const apiUtils = new APIUtils(apiContext);

    // Get the token and create an order (assert non-null since API utilities should return strings)
    token = (await apiUtils.getToken())!;
    orderID = (await apiUtils.createOrder())!;

});


test('End-to-end Testing', async ({ page }) => {


  // browser window > local storage > saving token for execuation next tests without logging in each time
  page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, token);

  // Navigate to the base URL after setting the token in local storage
  await page.goto(BASE_URL);


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
    if (orderID.includes(rowOrderId.trim())) {
      await allOrderRows.nth(i).locator('button:has-text("View")').click();
      console.log(`Order with ID: ${orderID} found and View button clicked.`);
      break;
    }
    if (i === rowCount - 1) {
      throw new Error(`Order with ID: ${orderID} not found in My Orders.`);
    }
  }

  const orderDetailsIdLocator = page.locator('.col-text');
  const orderDetailsId = (await orderDetailsIdLocator.textContent() ?? '');
  expect(orderID.includes(orderDetailsId)).toBeTruthy();

  await page.waitForTimeout(3000); // wait to visually verify order confirmation


});