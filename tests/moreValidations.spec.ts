import { test, expect } from '@playwright/test';
import { time } from 'console';

test('Show/Hide Textbox', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    const URL1 = 'https://google.com';
    const showHideBox = page.locator('#displayed-text');
    const hideBtn = page.locator('#hide-textbox');
    const showBtn = page.locator('#show-textbox');


    await page.goto(BASE_URL);
    await page.goto(URL1);
    await page.goBack();
    await page.goForward();
    await page.goBack();

    await showHideBox.scrollIntoViewIfNeeded();
    await expect(showHideBox).toBeVisible();
    await expect(showHideBox).not.toBeHidden();

    await hideBtn.click();
    await expect(showHideBox).toHaveAttribute('style', 'display: none;');
    await expect(showHideBox).not.toBeVisible();
    await expect(showHideBox).toBeHidden();

    await showBtn.click();
    await expect(showHideBox).toHaveAttribute('style', 'display: block;');
    await expect(showHideBox).toBeVisible();
    await expect(showHideBox).not.toBeHidden();

  await page.waitForTimeout(1500);
});

test('alert validation - without dialog', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);

    await page.locator('#alertbtn').click();

});

test('alert validation - with dialog => dialog.accept', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);

    page.on('dialog', dialog => dialog.accept());
    await page.locator('#alertbtn').click();
});

test('alert validation - with async dialog', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);

    await page.locator('#alertbtn').click();
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
});

test('popup validation - without dialog', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);


    // Clicking confirm button and dismissing the alert
    await page.locator('#confirmbtn').click();

});


test('popup validation - dialog => dialog.dismiss', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);


    // Clicking confirm button and dismissing the alert
    page.on('dialog', dialog => dialog.dismiss());
    await page.locator('#confirmbtn').click();

});

test('popup validation - async dialog.dismiss', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);


    // Clicking confirm button and dismissing the alert
    await page.locator('#confirmbtn').click();
    page.on('dialog', async dialog => {
        await dialog.dismiss();
    });

});

test('popup validation - dialog => dialog.accept', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);


    // Clicking confirm button and accepting the alert
    await page.locator('#confirmbtn').click();
    page.on('dialog', dialog => dialog.accept());

});

test('popup validation - async dialog.accept', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);


    // Clicking confirm button and dismissing the alert
    await page.locator('#confirmbtn').click();
    page.on('dialog', async dialog => {
        await dialog.accept();
    });

});

test.only('Mouse hover validation', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';
    await page.goto(BASE_URL);

    const mouseHoverBtn = page.locator('#mousehover');
    const topBtn = page.locator('a[href="#top"]');
    const reloadBtn = page.locator('a:text("Reload")');

    await mouseHoverBtn.hover();
    await expect(topBtn).toBeVisible();
    await expect(reloadBtn).toBeVisible();

    await topBtn.click();
    

    await page.waitForTimeout(1500);
});
