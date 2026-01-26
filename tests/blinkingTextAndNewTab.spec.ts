import {test, expect, Browser} from '@playwright/test';

test('handling blinking text', async ({browser})=> {
    const context = await browser.newContext();
    const page = await context.newPage();

    const BASE_URL = 'https://rahulshettyacademy.com/loginpagePractise/';
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Locate the blinking text element
    const blinkingText = page.locator('.blinkingText');
    await expect(blinkingText).toBeVisible();
    await expect(blinkingText).toHaveText(/Free Access/i);
    const animation = await blinkingText.evaluate(el =>
    window.getComputedStyle(el).animationName
  );

    expect(animation).not.toBe('none');

    // Verify the blinking text content
    const textContent = await blinkingText.textContent();
    console.log(`Blinking text content: ${textContent}`);
    expect(textContent).toBe('Free Access to InterviewQues/ResumeAssistance/Material');

    // Click and wait for the new tab (popup) to open
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      blinkingText.click()
    ]);

    // Wait for the new tab to finish loading
    await newPage.waitForLoadState('networkidle');

    // Interact / assert on the new tab
    console.log('New tab URL:', newPage.url());
    // Example assertions (adjust selectors/expectations to the actual target page):
    await expect(newPage).toHaveURL('https://rahulshettyacademy.com/documents-request');
    // await expect(newPage.locator('h1')).toContainText('Interview');

})

test('handling new tab - without promise.all', async ({browser})=> {
    const context = await browser.newContext();
    const page = await context.newPage();

    const BASE_URL = 'https://rahulshettyacademy.com/loginpagePractise/';
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Locate the "Free Access" link that opens a new tab
    const freeAccessLink = page.locator('.blinkingText');
    freeAccessLink.click();
    const newPage = await context.waitForEvent('page');
    // Wait for the new tab to finish loading
    await expect(newPage).toHaveURL('https://rahulshettyacademy.com/documents-request');
    await newPage.waitForLoadState('networkidle');
    
})

test('handling new tab', async ({browser})=> {
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


})