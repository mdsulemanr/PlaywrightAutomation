import {test, expect, Browser} from '@playwright/test';

test('Dropdown handling', async ({browser})=> {
    const context = await browser.newContext();
    const page = await context.newPage();

    const BASE_URL = 'https://rahulshettyacademy.com/loginpagePractise/';
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Locate the dropdown element
    const userRoleDropdown = page.locator('select.form-control');
    await userRoleDropdown.selectOption('consult'); // select by value attribute


    // Verify the selected option
    const selectedValue = await userRoleDropdown.inputValue();
    console.log(`Selected value: ${selectedValue}`);
    expect(selectedValue).toBe('consult');
    page.pause();

    const adminUser = page.getByRole('radio', {name: 'Admin'});
    const onlyUser = page.getByRole('radio', { name: 'User' });

    await adminUser.check();
    expect(await adminUser.isChecked()).toBeTruthy();
    await expect(adminUser).toBeChecked();
    expect(await onlyUser.isChecked()).toBeFalsy();
    await expect(onlyUser).not.toBeChecked();

    await onlyUser.click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(adminUser).toBeChecked();
    await expect(onlyUser).not.toBeChecked();
    
    await onlyUser.click();
    await page.locator('#okayBtn').click(); // assuming there's a confirmation dialog
    expect(await onlyUser.isChecked()).toBeTruthy();
    await expect(onlyUser).toBeChecked();
    expect(await adminUser.isChecked()).toBeFalsy();
    await expect(adminUser).not.toBeChecked();

    const termsCheckbox = page.locator('#terms');
    await expect(termsCheckbox).not.toBeChecked();
    await termsCheckbox.check();
    await expect(termsCheckbox).toBeChecked();
    await expect(termsCheckbox.isChecked()).toBeTruthy();

    await termsCheckbox.uncheck();
    await expect(termsCheckbox).not.toBeChecked();
    expect(await termsCheckbox.isChecked()).toBeFalsy();

})