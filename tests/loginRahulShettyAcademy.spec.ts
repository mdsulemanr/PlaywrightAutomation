import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login to Rahul Shetty Academy', () => {
  const BASE_URL = 'https://rahulshettyacademy.com/client/';
  const DASHBOARD_URL = 'https://rahulshettyacademy.com/client/#/dashboard/dash';
  const EMAIL = 'testertesty@gmail.com';
  const PASSWORD = 'Testertesty!1';
  const PRODUCT_NAME = 'ADIDAS ORIGINAL';

  test('User can login and verify ADIDAS ORIGINAL product on dashboard', async ({ page }) => {
    // Step 1: Navigate to login page
    const loginPage = new LoginPage(page, BASE_URL);
    await loginPage.goto();

    // Step 2: Enter username
    await loginPage.enterEmail(EMAIL);

    // Step 3: Enter password
    await loginPage.enterPassword(PASSWORD);

    // Step 4: Tick the remember me checkbox if visible
    await loginPage.tickRememberMeCheckbox();

    // Step 5: Click Login and get dashboard page
    const dashboardPage = await loginPage.clickLogin();

    // Step 6: Verify navigation to dashboard
    await expect(page).toHaveURL(DASHBOARD_URL);

    // Step 7: Verify ADIDAS ORIGINAL is visible on the dashboard
    const productVisible = await dashboardPage.verifyProductVisible(PRODUCT_NAME);
    expect(productVisible).toBe(true);
  });
});
