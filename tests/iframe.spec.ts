import { test, expect } from '@playwright/test';
import { time } from 'console';

test('iframe', async ({ page }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';

    await page.goto(BASE_URL);
    const frame = page.frameLocator('#courses-iframe');
    const allAccessLink = frame.locator('a').filter({ hasText: 'All-Access' }).first();
    await expect(allAccessLink).toBeVisible();
    await allAccessLink.click();
    page.on('dialog', dialog => dialog.accept());
    
    const heading = page.getByRole('heading', { name: 'Choose Your All-Access Plan' });
    page.on('dialog', dialog => dialog.accept());

    const headtext = await heading.textContent();
    page.on('dialog', dialog => dialog.accept());
    console.log(headtext);
    await expect(headtext).toContain('All-Access');
    

    await page.waitForTimeout(3000);
});

