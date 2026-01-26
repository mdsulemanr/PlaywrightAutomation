import {test, expect} from '@playwright/test'; // test annotation

test('sepecial selectors in Playwright', async ({browser})=> // playwright test takes two arguments, test name and a function.
{

    const context = await browser.newContext(); // Create a new browser context
    const page = await context.newPage(); // Create a new page in the context
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    // page.getByLabel('Check me out if you Love IceCreams!').check();
    // page.getByLabel('Gender').selectOption('Male');
    // page.getByLabel('Employed').check();

    // page.getByPlaceholder('Password').fill('learning');
    page.getByLabel('Password').fill('learning');
    page.getByRole('button', {name: 'Submit'}).click();
    // expect(await page.getByText('The Form has been submitted successfully!.', { exact: true }).isVisible()).toBeTruthy();
    page.getByRole('link', {name: 'Shop'}).click();
    page.locator('app-card').filter({ hasText: 'Samsung Note 8' }).getByRole('button', {name: 'Add'}).click();

    await page.waitForTimeout(3000);

});