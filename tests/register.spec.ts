// tests/register.spec.ts
import { test, expect } from '@playwright/test';

test('register a new user', async ({ page }) => {
  // Go directly to the register page
  await page.goto('https://rahulshettyacademy.com/client/#/auth/register');

  // Make a unique email every run
  const email = `testuser_${Date.now()}@example.com`;

  // --- Fill text fields ---
  await page.getByPlaceholder('First Name').fill('Suleman');
  await page.getByPlaceholder('Last Name').fill('Rafi');
  await page.getByPlaceholder('email@example.com').fill(email);
  await page.getByPlaceholder('enter your number').fill('3001234567');

  // --- Occupation dropdown ---
  // If it is a native <select>, this will work:
  await page.getByRole('combobox').selectOption('Student');
  // (If value mismatch occurs, you can instead click the dropdown and then click the text:
  // await page.getByRole('combobox', { name: 'Occupation' }).click();
  // await page.getByRole('option', { name: 'Student' }).click();
  // )

  // --- Gender radio button ---
  await page.getByRole('radio', { name: 'Male', exact: true }).check();

  // --- Passwords ---
  await page.getByRole('textbox', { name: 'Passsword' }).fill('StrongPass123!');
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('StrongPass123!');

  // --- Age checkbox ---
  await page.getByRole('checkbox').check();

  // --- Submit form ---
  await page.getByRole('button', { name: 'Register' }).click();

  // Optional: assert something after successful registration (toast / redirect)
  await expect(page.getByRole('heading', { name: 'Account Created Successfully', level: 1 })).toContainText("Account Created Successfully");
});
