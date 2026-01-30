import { test, expect, request, type APIRequestContext } from '@playwright/test';
import { EcomApi } from './utils/ecomApi';
import { DashboardPage } from '../pages/dashboard.page';
import { OrderDetailsPage } from '../pages/orderDetails.page';

const BASE_URL = 'https://rahulshettyacademy.com/client/';

// Prefer env vars (safe for CI). Fallbacks kept for local learning.
const EMAIL = process.env.ECOM_EMAIL ?? 'testertesty@gmail.com';
const PASSWORD = process.env.ECOM_PASSWORD ?? 'Testertesty!1';

const COUNTRY = process.env.ECOM_COUNTRY ?? 'Indonesia';
const PRODUCT_ID = process.env.ECOM_PRODUCT_ID ?? '6964a1cbc941646b7a91786b';

let apiContext: APIRequestContext;
let token: string;
let orderId: string;

test.beforeAll(async () => {
  apiContext = await request.newContext();
  const api = new EcomApi(apiContext);

  const login = await api.login(EMAIL, PASSWORD);
  token = login.token;

  const order = await api.createOrder(token, COUNTRY, PRODUCT_ID);
  orderId = order.orders[0];

  // API-level assertions belong here (not inside util)
  expect(login.message).toContain('Login');
  expect(order.message).toContain('Order Placed');
  expect(orderId).toBeTruthy();
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test('E2E: order is visible in My Orders and opens details', async ({ page }) => {
  // set token before any app scripts run
  page.addInitScript((t) => window.localStorage.setItem('token', t), token);

  const dashboard = new DashboardPage(page, BASE_URL);
  await dashboard.goto();

  const ordersPage = await dashboard.openMyOrders();
  await ordersPage.openOrderById(orderId);

  const details = new OrderDetailsPage(page);
  const displayedId = await details.getDisplayedOrderId();

  expect(orderId).toContain(displayedId);
});
