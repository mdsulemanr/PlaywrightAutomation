import {test, expect} from '@playwright/test';


test('handling two tabs', async ({browser})=> {
    const context = await browser.newContext();
    const page = await context.newPage();

    const BASE_URL = 'https://rahulshettyacademy.com/loginpagePractise/';
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Locate the "Free Access" link that opens a new tab
    const freeAccessLink = page.locator('.blinkingText');

    // Wait for the new tab (popup) to open
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      freeAccessLink.click()
    ]);
    // Wait for the new tab to finish loading
    await expect(newPage).toHaveURL('https://rahulshettyacademy.com/documents-request');
    await newPage.waitForLoadState('networkidle');
    const text = await newPage.locator('.im-para.red').textContent();
    console.log(text);
    if (!text) {
        throw new Error('Expected non-empty text from selector .im-para.red');
    }
    // safer extraction using a regex for the first email-like token
    const emailMatch = text.match(/(?<=@)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
    if (!emailMatch) throw new Error('No email found in the popup text');
    const email = emailMatch[0];

    // Switch back to the original tab and use the extracted email
    await page.bringToFront();
    await page.locator('#username').fill(email);
    console.log(await page.locator('#username').inputValue());
    expect(await page.locator('#username').inputValue()).toBe(email);

    await page.waitForTimeout(3000);
})