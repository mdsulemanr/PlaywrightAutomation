import { test, Browser, expect } from '@playwright/test';

// Verify successful login with valid credentials
// Verify Dashboard page is displayed after login
// Make use of POM design pattern concepts
test('Capture and assert dynamic alert text with auto playwright wait', async ({browser})=> {

    const context = await browser.newContext();
    const page = await context.newPage();
    
    const url = 'https://rahulshettyacademy.com/loginpagePractise/';
    const dashboardUrl = 'https://rahulshettyacademy.com/angularpractice/shop';
    const dashboardUrlPattern = /.*shop/;
    const signInBtnId = '#signInBtn';
    const usernameId = '#username';
    const passwordId = '#password';
    const correctUsername = 'rahulshettyacademy';
    const correctPassword = 'learning';
    const expectedDashboardTitle = 'LoginPage Practise | Rahul Shetty Academy';
    const productsTitleSelector = '.card-title a';

    const signInBtnLocator = page.locator(signInBtnId);
    const usernameLocator = page.locator(usernameId);
    const passwordLocator = page.locator(passwordId);
    const productsTitleLocator = page.locator(productsTitleSelector);

    await page.goto(url);

    await usernameLocator.fill(correctUsername);
    await passwordLocator.fill(correctPassword);
    await signInBtnLocator.click();
    await expect(page).toHaveTitle(expectedDashboardTitle);
    await page.waitForURL(dashboardUrl); // wait for navigation to dashboard
    await expect(page).toHaveURL(dashboardUrlPattern);

    // console.log(await productsTitleLocator.first().textContent());
    // console.log(await productsTitleLocator.last().textContent());
    console.log(await productsTitleLocator.allTextContents());



});