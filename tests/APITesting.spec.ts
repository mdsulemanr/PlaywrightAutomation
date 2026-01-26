import { test, expect, request } from '@playwright/test';

let token: string;
let orderID;

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
    
    // console.log(loginRespose.body());
    // console.log(loginRespose.headers());
    // console.log(loginRespose.json());
    // console.log(loginRespose.ok());
    // console.log(loginRespose.status());
    // console.log(loginRespose.statusText());
    // console.log(loginRespose.text());
    // console.log(loginRespose.url());
    
    const responseBody = await loginRespose.json();
    expect(responseBody).toHaveProperty('token');
    expect(responseBody).toHaveProperty('message');
    expect(responseBody).toHaveProperty('userId');
    expect(responseBody.message).toBe(expectedResponseMessage);
    token = responseBody.token;
    // console.log('Auth Token:', token);

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
            productOrderedId:"6960eae1c941646b7a8b3ed3"
          }]
        },
        headers: orderHeaders
    });

    expect(orderIdResponse.ok());
    expect(orderIdResponse.status()).toBe(201);
    
    const orderResponseBody = await orderIdResponse.json();
    expect(orderResponseBody).toHaveProperty('orders');
    expect(orderResponseBody).toHaveProperty('productOrderId');
    expect(orderResponseBody).toHaveProperty('message');
    expect(orderResponseBody.message).toBe("Order Placed Successfully");

    orderID = orderResponseBody.productOrderId[0];
    console.log(orderID);

});

test('End-to-end Testing', async ({ page }) => {
  // browser fixture exists here with proper type Browser

//   const context = await browser.newContext(); // create a new browser context
//   const page = await context.newPage(); // create a new page in the context

  const BASE_URL = 'https://rahulshettyacademy.com/client/';
  const CART_URL = 'https://rahulshettyacademy.com/client/#/dashboard/cart';
  const EMAIL_ADDRESS = 'testertesty@gmail.com';

  const productName = 'iphone 13 pro';
  const addToCartBtn = 'Add To Cart';
  const allProductCardsSelector = '.card-body';
  const productTitleSelector = 'h5 > b';
  const cartBtnSelector = '[routerlink*="cart"]';

  const allProductsTitleLocator = page.locator(allProductCardsSelector);
  const productTitleLocator = allProductsTitleLocator.locator(productTitleSelector);

  // browser window > local storage > saving token for execuation next tests without logging in each time
  page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, token);

  await page.goto(BASE_URL);

});
