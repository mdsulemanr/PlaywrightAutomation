import { test, expect } from '@playwright/test';

test('login through API request', async ({ page, request }) => {

    const BASE_URL = 'https://rahulshettyacademy.com/client/auth/login';
    const REQUEST_URL = 'https://rahulshettyacademy.com/api/ecom/auth/login';
    const userEmail = "testertesty@gmail.com";
    const userPassword = "Testertesty!1";
    const PAYLOAD = `{"userEmail":"${userEmail}",
                    "userPassword":"${userPassword}"}`;
    const headers = {
        'referer': 'https://rahulshettyacademy.com/client/',
        'Content-Type': 'application/json',
    };
    const expectedResponseMessage = "Login Successfully";


    // Perform login via API request
    const response = await request.post(REQUEST_URL, {
        data: PAYLOAD,
        headers: headers,
    });

    // expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe(expectedResponseMessage);
    // expect(responseBody).toHaveProperty('status');
    // expect(responseBody.status).toBe('success');
    expect(responseBody).toHaveProperty('token');
    const token = responseBody.token;
    console.log('Auth Token:', token);


    await page.goto(BASE_URL);

    await page.waitForTimeout(3000);
});

