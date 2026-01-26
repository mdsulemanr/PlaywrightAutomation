import { test, expect } from "@playwright/test";
 
test('@QW Security test request intercept', async ({ page }) => {

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    page.on('requestfailed', request => console.log(`REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`));
    page.on('request', request => console.log(`REQUEST: ${request.method()} ${request.url()}`));
    page.on('response', response => console.log(`RESPONSE: ${response.status()} ${response.url()}`));
 
    //login and reach orders page
    await page.goto("https://rahulshettyacademy.com/client");

    // Intercept css requests
    await page.route("**/*.css", route => route.abort());
    await page.reload();

    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.locator(".card-body b").first().waitFor();

    // Intercept image requests
    await page.route("**/*{.jpg,.jpeg,.png}", route => route.abort());
    // await page.pause();
 
    await page.locator("button[routerlink*='myorders']").click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' }))
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
 
 
})