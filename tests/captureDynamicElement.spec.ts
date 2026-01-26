import { test, Browser, expect } from '@playwright/test';

// Empty username/password shows alert message
test('Capture and assert dynamic alert text with auto playwright wait', async ({browser})=> {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await page.locator('#signInBtn').click();

    const expectedAlertText = 'Empty username/password.';
    // Capture and assert dynamic alert text with auto playwright wait
    // const dynamicAlertTxt = await page.locator('.alert.alert-danger').textContent();
    const dynamicAlert = page.locator('[style*="block"]');
    const actualDynamicAlertTxt = await page.locator('[style*="block"]').textContent();
    
    console.log(actualDynamicAlertTxt);
    await expect(actualDynamicAlertTxt).toEqual(expectedAlertText);
    await expect(dynamicAlert).toContainText('Empty');

});

// Invalid login shows error message
test('invalid login shows error message', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  await page.locator('#username').fill('wrongUser');
  await page.locator('#password').fill('wrongPass');
  await page.locator('#signInBtn').click();

  // Locator for dynamic error message
  const errorLocator = page.locator("[style*='block']");

  // Extract and print the text
  console.log(await errorLocator.textContent());

  // Validate the error message
  await expect(errorLocator).toContainText("Incorrect");
});
