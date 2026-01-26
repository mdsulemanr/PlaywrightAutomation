import { test, expect, type BrowserContext, type Page } from '@playwright/test';

const BASE_URL = 'https://rahulshettyacademy.com/client/';
const CART_URL = 'https://rahulshettyacademy.com/client/#/dashboard/cart';

const EMAIL_ADDRESS = 'testertesty@gmail.com';
const PASSWORD = 'Testertesty!1';

const productName = 'iphone 13 pro';
const addToCartBtn = 'Add To Cart';

const allProductCardsSelector = '.card-body';
const productTitleSelector = 'h5 > b';
const cartBtnSelector = '[routerlink*="cart"]';

let context: BrowserContext;
let page: Page;
let orderId = '';

async function addProductToCart(page: Page, productName: string) {
  const cards = page.locator(allProductCardsSelector);
  const titles = cards.locator(productTitleSelector);

  await cards.first().waitFor(); // products visible
  const count = await titles.count();

  for (let i = 0; i < count; i++) {
    const title = (await titles.nth(i).textContent())?.trim();
    if (title === productName) {
      await Promise.all([
        // backend call that confirms add-to-cart happened
        page.waitForResponse((res) => res.url().includes('/api/ecom/user/add-to-cart') && res.ok()),
        cards.nth(i).locator(`button:has-text("${addToCartBtn}")`).click(),
      ]);
      return;
    }
  }

  throw new Error(`Product not found on dashboard: ${productName}`);
}

test.describe.serial('E2E flow (serial + same page)', () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto(BASE_URL);

    await page.locator('#userEmail').fill(EMAIL_ADDRESS);
    await page.locator('#userPassword').fill(PASSWORD);
    await page.locator('#login').click();

    // Dashboard loaded
    await page.locator('.card-body b').first().waitFor();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Select Product', async () => {
    await page.goto(BASE_URL);
    await addProductToCart(page, productName);
  });

  test('Validate Cart Contents', async () => {
    await page.locator(cartBtnSelector).click();
    await page.waitForURL(CART_URL);

    await page.locator('.cart li .cartSection').first().waitFor();
    await expect(page.locator(`h3:has-text("${productName}")`)).toBeVisible();
  });

  test('Checkout Process', async () => {
    await page.locator('text=Checkout').click();

    await page.locator('input[placeholder="Select Country"]').pressSequentially('ind', { delay: 150 });
    await page.locator('section[class*="results"]').waitFor();

    await page.getByText('Indonesia', { exact: true }).click();

    // IMPORTANT: await expect(...)
    await expect(page.locator('label[type="text"]')).toHaveText(EMAIL_ADDRESS);

    await page.locator('.btnn.action__submit').click();
  });

  test('Order Confirmation', async () => {
    const msg = page.locator('.hero-primary');
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText(' Thankyou for the order. ');

    orderId = (await page.locator('.em-spacer-1 .ng-star-inserted').textContent())?.trim() ?? '';
    expect(orderId).not.toBe('');
    console.log(`Order ID: ${orderId}`);
  });

  test('Order History Verification', async () => {
    await page.locator('button[routerlink*="myorders"]').click();

    await page.locator('tbody tr').first().waitFor();
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const rowOrderId = (await rows.nth(i).locator('th').textContent())?.trim() ?? '';
      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator('button:has-text("View")').click();
        break;
      }
      if (i === rowCount - 1) {
        throw new Error(`Order with ID ${orderId} not found in My Orders`);
      }
    }

    const detailsId = (await page.locator('.col-text').textContent())?.trim() ?? '';
    expect(orderId.includes(detailsId)).toBeTruthy();
  });
});
