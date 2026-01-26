import { test, expect } from '@playwright/test'; // test annotation

test('Browser Playwright fixture', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com';




    await page.goto(`${BASE_URL}/loginpagePractise/`);
    await page.screenshot({ path: 'loginPage.png' });

    const title = await page.title();
    console.log(title);
    await expect(page).toHaveTitle(title);
    await page.locator('select.form-control').screenshot({ path: 'formControl.png' });
    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator('#password').fill('Learning@830$3mK2');
    await page.locator('#signInBtn').click();
    await page.waitForResponse(response => response.url().includes('angularpractice') && response.status() === 200);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'dashboardPage.png', fullPage: true });
    // Assertions for screenshots to compare with baseline images
    expect(await page.screenshot()).toMatchSnapshot('dashboardPage.png');
});