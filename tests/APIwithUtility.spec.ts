import { test, expect, request } from '@playwright/test';

let token: string | undefined;
let orderID: string;
const BASE_URL = 'https://rahulshettyacademy.com/client/';

const LOGIN_URL = 'https://rahulshettyacademy.com/api/ecom/auth/login';
const PAYLOAD = {
                    userEmail:"testertesty@gmail.com",
                    userPassword:"Testertesty!1"
            };
const headers = {
                'referer': 'https://rahulshettyacademy.com/client/',
                'Content-Type': 'application/json',
            };

test.beforeAll( async () => {

    const expectedResponseMessage = "Login Successfully";

    // Request context created before all tests
    const apiContext = await request.newContext();
    const loginRespose = await apiContext.post(LOGIN_URL, {
        data: PAYLOAD,
        headers: headers
    });

    expect(loginRespose.ok()).toBeTruthy();
    expect(loginRespose.status()).toBe(200);
        
    const responseBody = await loginRespose.json();
    expect(responseBody).toHaveProperty('token');
    expect(responseBody).toHaveProperty('message');
    expect(responseBody).toHaveProperty('userId');
    expect(responseBody.message).toBe(expectedResponseMessage);
    token = responseBody.token;
    console.log('Auth Token:', token);

    // Make an order using order api
    if (!token) {
        throw new Error('Auth token is missing');
    }
    const orderHeaders = {
            'Authorization': token,
            'content-type': 'application/json'
        };
    const orderIdResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
        data: {
          orders:[{
            country:"Indonesia",
            productOrderedId:"68a961719320a140fe1ca57c"
          }]
        },
        headers: orderHeaders
    });

    expect(orderIdResponse.ok()).toBeTruthy();
    expect(orderIdResponse.status()).toBe(201);
    
    const orderResponseBody = await orderIdResponse.json();
    expect(orderResponseBody).toHaveProperty('orders');
    expect(orderResponseBody).toHaveProperty('productOrderId');
    expect(orderResponseBody).toHaveProperty('message');
    expect(orderResponseBody.message).toBe("Order Placed Successfully");

    orderID = orderResponseBody.orders[0];
    console.log(orderID);

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