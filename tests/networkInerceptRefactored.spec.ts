import { test, expect, request, type APIRequestContext, type Page } from '@playwright/test';

// -------------------- Config / Test Data --------------------
const UI_BASE_URL = 'https://rahulshettyacademy.com/client/';
const CART_URL = 'https://rahulshettyacademy.com/client/#/dashboard/cart';

const API_BASE_URL = 'https://rahulshettyacademy.com/api/ecom';
const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const CREATE_ORDER_URL = `${API_BASE_URL}/order/create-order`;
const GET_ORDERS_URL = (userId: string) => `${API_BASE_URL}/order/get-orders-for-customer/${userId}`;

const USER = {
  email: 'testertesty@gmail.com',
  password: 'Testertesty!1',
};

// This is the product you add in UI flow
const PRODUCT_NAME = 'iphone 13 pro';

// This is used only for API create-order setup (productOrderedId from their DB)
const API_PRODUCT_ORDERED_ID = '6960eae1c941646b7a8b3ed3';

type LoginResponse = {
  token: string;
  userId: string;
  message: string;
};

type CreateOrderResponse = {
  orders?: string[];            // some versions return this
  productOrderId?: string | string[]; // some versions return this
  message: string;
};

// -------------------- Shared state (from beforeAll) --------------------
let apiContext: APIRequestContext;
let authToken = '';
let userId = '';
let seededOrderId = ''; // optional: created via API

// -------------------- Helpers --------------------
async function apiLogin(api: APIRequestContext): Promise<{ token: string; userId: string }> {
  const res = await api.post(LOGIN_URL, {
    data: {
      userEmail: USER.email,
      userPassword: USER.password,
    },
    headers: {
      referer: UI_BASE_URL,
      'content-type': 'application/json',
    },
  });

  expect(res.ok()).toBeTruthy();
  expect(res.status()).toBe(200);

  const body = (await res.json()) as LoginResponse;
  expect(body.message).toBe('Login Successfully');
  expect(body.token).toBeTruthy();
  expect(body.userId).toBeTruthy();

  return { token: body.token, userId: body.userId };
}

function extractOrderId(body: CreateOrderResponse): string {
  // make it resilient because this API sometimes varies in examples
  const ordersId = body.orders?.[0];
  if (ordersId) return ordersId;

  const poid = body.productOrderId;
  if (Array.isArray(poid)) return poid[0] ?? '';
  if (typeof poid === 'string') return poid;

  return '';
}

async function apiCreateOrder(api: APIRequestContext, token: string): Promise<string> {
  const res = await api.post(CREATE_ORDER_URL, {
    data: {
      orders: [
        {
          country: 'Indonesia',
          productOrderedId: API_PRODUCT_ORDERED_ID,
        },
      ],
    },
    headers: {
      Authorization: token,
      'content-type': 'application/json',
    },
  });

  expect(res.ok()).toBeTruthy();
  // their API usually returns 201 for create-order
  expect(res.status()).toBe(201);

  const body = (await res.json()) as CreateOrderResponse;
  expect(body.message).toBe('Order Placed Successfully');

  const orderId = extractOrderId(body);
  expect(orderId).toBeTruthy();

  return orderId;
}

async function setTokenInLocalStorage(page: Page, token: string) {
  await page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);
}

async function addProductToCart(page: Page, productName: string) {
  const cards = page.locator('.card-body');
  await expect(cards.first()).toBeVisible();

  // Find the card that contains the product name and click "Add To Cart" inside it
  const targetCard = cards.filter({ hasText: productName }).first();
  await expect(targetCard).toBeVisible();

  await targetCard.locator('button:has-text("Add To Cart")').click();
}

async function mockOrdersEmpty(page: Page, userId: string) {
  const pattern = `**/api/ecom/order/get-orders-for-customer/${userId}*`;

  await page.route(pattern, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [],
        count: 0,
        message: 'No Orders',
      }),
    });
  });
}

// -------------------- Global setup (API once) --------------------
test.beforeAll(async () => {
  apiContext = await request.newContext();

  const login = await apiLogin(apiContext);
  authToken = login.token;
  userId = login.userId;

  // Optional: seed one order using API so you have data in system (useful for real E2E / debugging)
  seededOrderId = await apiCreateOrder(apiContext, authToken);
  console.log('Seeded Order ID (API):', seededOrderId);
});

test.afterAll(async () => {
  await apiContext?.dispose();
});

// -------------------- Tests --------------------
test.describe('Hybrid UI + API + Network Mock (single file learning)', () => {
  test('Real E2E: place an order via UI (no mocking)', async ({ page }) => {
    await setTokenInLocalStorage(page, authToken);
    await page.goto(UI_BASE_URL);

    await addProductToCart(page, PRODUCT_NAME);

    await page.locator('[routerlink*="cart"]').click();
    await page.waitForURL(CART_URL);

    await expect(page.locator('.cart li .cartSection').first()).toBeVisible();
    await expect(page.locator(`h3:has-text("${PRODUCT_NAME}")`)).toBeVisible();

    await page.locator('text=Checkout').click();

    await page.locator('input[placeholder="Select Country"]').pressSequentially('ind', { delay: 150 });
    await expect(page.locator('section[class*="results"]')).toBeVisible();
    await page.getByText('Indonesia', { exact: true }).click();

    await expect(page.locator('label[type="text"]')).toHaveText(USER.email);

    await page.locator('.btnn.action__submit').click();

    const confirmation = page.locator('.hero-primary');
    await expect(confirmation).toBeVisible();
    await expect(confirmation).toHaveText(' Thankyou for the order. ');

    const orderIdText = (await page.locator('.em-spacer-1 .ng-star-inserted').textContent())?.trim() ?? '';
    console.log('Order ID (UI):', orderIdText);

    // Light sanity check: order id shows up
    expect(orderIdText.length).toBeGreaterThan(5);
  });

  test('Mock: Orders API returns empty => UI shows "No Orders"', async ({ page }) => {
    await setTokenInLocalStorage(page, authToken);

    // Mock must be registered BEFORE the request happens
    await mockOrdersEmpty(page, userId);

    await page.goto(UI_BASE_URL);

    // go to My Orders (this triggers get-orders-for-customer)
    await page.locator('button[routerlink*="myorders"]').click();

    // ensure the mocked response was actually used
    await page.waitForResponse((res) => res.url().includes(`/order/get-orders-for-customer/${userId}`) && res.status() === 200);

    // Assert UI empty state (your selector used .mt-4, keep it but assert text robustly)
    await expect(page.locator('.mt-4')).toContainText(/no orders/i);
  });
});
