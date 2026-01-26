import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://rahulshettyacademy.com/client/#/dashboard/dash';
const USERNAME = 'testuser01@example.com';
const PASSWORD = 'StrongPass123!';

class LoginPage {
    readonly page: Page;
    readonly emailInput;
    readonly passwordInput;
    readonly submitButton;
    readonly dashboardHeading;
    readonly logoutButton;

    constructor(page: Page) {
        this.page = page;
        // resilient selectors for common patterns
        this.emailInput = page.locator('input[name="email"], input[type="email"], input#email, [placeholder*="Email"]');
        this.passwordInput = page.locator('input[name="password"], input[type="password"], input#password, [placeholder*="Password"]');
        this.submitButton = page.locator('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"], input[type="submit"]');
        this.dashboardHeading = page.getByRole('heading', { name: /dashboard/i }).first();
        this.logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), text=Logout');
    }

    async goto() {
        // Navigate to the app root; use base URL but strip hash since the app may redirect to login first
        await this.page.goto(BASE_URL, { waitUntil: 'networkidle' });
        // ensure the login UI is visible
        await expect(this.emailInput).toBeVisible({ timeout: 10_000 });
        await expect(this.passwordInput).toBeVisible({ timeout: 10_000 });
        await expect(this.submitButton).toBeVisible({ timeout: 10_000 });
    }

    async login(username: string, password: string) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15_000 }).catch(() => null),
            this.submitButton.click()
        ]);
        // Wait for dashboard or other post-login indicator
        await expect(this.dashboardHeading).toBeVisible({ timeout: 15_000 });
    }

    async assertLoggedIn() {
        // URL should contain dashboard route/hash
        await expect(this.page).toHaveURL(/dashboard/i);
        // dashboard heading visible
        await expect(this.dashboardHeading).toBeVisible();
        // logout should be present
        await expect(this.logoutButton).toBeVisible();
        // optionally ensure no login inputs visible anymore
        await expect(this.emailInput).toHaveCount(0);
        await expect(this.passwordInput).toHaveCount(0);
    }
}

test.describe('User login (POM) - Rahul Shetty Academy', () => {
    test('valid user can login and reach dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Navigate to app and assert login form present
        await test.step('Go to application and check login form', async () => {
            await loginPage.goto();
        });

        // Perform login
        await test.step('Perform login with valid credentials', async () => {
            await loginPage.login(USERNAME, PASSWORD);
        });

        // Assertions after login
        await test.step('Assert user is logged in and dashboard is visible', async () => {
            await loginPage.assertLoggedIn();

            // Additional sanity checks: page title should mention dashboard (if available)
            const title = await page.title();
            expect(title.toLowerCase()).toContain('dashboard');

            // Example: verify at least one dashboard widget or card is visible (generic selector)
            const dashboardWidget = page.locator('div[class*="card"], section[class*="dashboard"], div[class*="widget"], main').first();
            await expect(dashboardWidget).toBeVisible({ timeout: 5000 });
        });
    });
});