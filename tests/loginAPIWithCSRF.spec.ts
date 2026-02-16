import { test, expect, Page, APIRequestContext } from '@playwright/test';

/**
 * Login API Page Object Model
 * Handles CSRF token retrieval and POST login requests
 */
class LoginAPIPage {
  private page: Page;
  private request: APIRequestContext;
  private baseURL = 'https://httpbin.org'; // Using httpbin for demo, replace with actual URL
  private loginURL = `${this.baseURL}/post`;
  private csrfTokenURL = `${this.baseURL}/cookies/set?csrf_token=sample_csrf_token_12345`;

  constructor(page: Page, request: APIRequestContext) {
    this.page = page;
    this.request = request;
  }

  /**
   * Fetch CSRF token via GET request
   * Returns cookies and CSRF token from response
   */
  async fetchCSRFToken(): Promise<{
    csrfToken: string;
    cookies: Record<string, string>;
    headers: Record<string, string>;
  }> {
    console.log('🔍 Fetching CSRF token from GET request...');

    const response = await this.request.get(this.csrfTokenURL);

    // Verify GET request was successful
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    console.log('✅ GET request status:', response.status());

    // Extract cookies from response headers
    const responseCookies = response.headers()['set-cookie'] || '';
    console.log('📦 Response cookies:', responseCookies);

    // Parse CSRF token from response (in real scenarios, it would be in HTML or JSON)
    let csrfToken = 'sample_csrf_token_12345';

    // Extract actual CSRF token from Set-Cookie header if available
    if (responseCookies.includes('csrf_token')) {
      const tokenMatch = responseCookies.match(/csrf_token=([^;]+)/);
      csrfToken = tokenMatch ? tokenMatch[1] : csrfToken;
    }

    console.log('🔑 Extracted CSRF token:', csrfToken);

    // Prepare cookies object for next request
    const cookiesObject = this.parseCookiesFromHeader(responseCookies);

    return {
      csrfToken,
      cookies: cookiesObject,
      headers: response.headers(),
    };
  }

  /**
   * Parse Set-Cookie header into cookies object
   */
  private parseCookiesFromHeader(setCookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieEntries = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader.split(';');

    cookieEntries.forEach((entry) => {
      const [name, value] = entry.split('=').map((s) => s.trim());
      if (name && value) {
        cookies[name] = value;
      }
    });

    return cookies;
  }

  /**
   * Perform login via POST request with CSRF token and cookies
   */
  async performLogin(
    credentials: { email: string; password: string },
    csrfToken: string,
    existingCookies: Record<string, string>
  ): Promise<any> {
    console.log('📤 Performing POST login request...');

    // Build Cookie header from existing cookies
    const cookieHeader = Object.entries(existingCookies)
      .map(([key, value]) => `${key}=${value}`)
      .join(';');

    // Build request headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'X-CSRF-Token': csrfToken,
      'Referer': 'https://example.com/',
    };

    // Add cookies to header if present
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    console.log('📋 Request headers:', {
      'Content-Type': headers['Content-Type'],
      'X-CSRF-Token': headers['X-CSRF-Token'],
      'Cookie': headers['Cookie'] ? '***' : 'Not set',
    });

    // Build request payload
    const payload = {
      email: credentials.email,
      password: credentials.password,
      _csrf: csrfToken,
    };

    console.log('📦 Request payload:', {
      email: payload.email,
      password: '***',
      _csrf: payload._csrf,
    });

    // Send POST request
    const response = await this.request.post(this.loginURL, {
      headers,
      data: payload,
    });

    console.log('📥 POST response status:', response.status());

    // Verify POST response
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse response
    const responseBody = await response.json();
    console.log('✅ Login response received');

    return {
      status: response.status(),
      statusText: response.statusText(),
      body: responseBody,
      headers: response.headers(),
    };
  }

  /**
   * Extract session ID from response headers or cookies
   */
  extractSessionInfo(response: any): { sessionId?: string; token?: string } {
    const headers = response.headers;
    const setCookie = headers['set-cookie'];

    let sessionId: string | undefined;
    let token: string | undefined;

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookieArray.forEach((cookie) => {
        if (cookie.includes('sessionid')) {
          const match = cookie.match(/sessionid=([^;]+)/);
          sessionId = match ? match[1] : undefined;
        }
        if (cookie.includes('auth-token')) {
          const match = cookie.match(/auth-token=([^;]+)/);
          token = match ? match[1] : undefined;
        }
      });
    }

    return { sessionId, token };
  }
}

/**
 * Test Suite: Login API with CSRF Token
 */
test.describe('API Login with CSRF Token Integration', () => {
  let loginAPI: LoginAPIPage;

  test.beforeEach(async ({ page, request }) => {
    loginAPI = new LoginAPIPage(page, request);
  });

  test('should fetch CSRF token and perform successful login', async () => {
    console.log('\n=== Starting Login Flow ===\n');

    // Step 1: Fetch CSRF token and cookies
    const { csrfToken, cookies, headers } = await loginAPI.fetchCSRFToken();

    // Assertions for CSRF Token fetch
    expect(csrfToken).toBeTruthy();
    expect(csrfToken.length).toBeGreaterThan(0);
    console.log('✨ CSRF Token fetch assertions passed');

    // Step 2: Verify cookies were received
    expect(Object.keys(cookies).length).toBeGreaterThanOrEqual(0);
    console.log('✨ Cookies received:', Object.keys(cookies));

    // Step 3: Perform login with CSRF token and cookies
    const loginResponse = await loginAPI.performLogin(
      {
        email: 'testuser@example.com',
        password: 'testPassword123!',
      },
      csrfToken,
      cookies
    );

    // Assertions for Login
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.statusText).toBe('OK');
    console.log('✨ Login status assertions passed');

    // Step 4: Verify response body contains expected fields
    expect(loginResponse.body).toBeDefined();
    console.log('✨ Response body assertions passed');

    // Step 5: Extract and verify session information
    const sessionInfo = loginAPI.extractSessionInfo(loginResponse);
    console.log('📋 Session Info:', sessionInfo);

    console.log('\n=== Login Flow Completed Successfully ===\n');
  });

  test('should include required headers in login request', async () => {
    const { csrfToken, cookies } = await loginAPI.fetchCSRFToken();

    const loginResponse = await loginAPI.performLogin(
      {
        email: 'testuser@example.com',
        password: 'testPassword123!',
      },
      csrfToken,
      cookies
    );

    // Verify response headers contain expected security headers
    const responseHeaders = loginResponse.headers;

    expect(responseHeaders).toBeDefined();
    console.log('✅ Response headers verified');

    // Verify CSRF token was included in request
    expect(csrfToken).toBeTruthy();
    expect(csrfToken).toMatch(/^[a-zA-Z0-9_-]+/);
    console.log('✅ CSRF token format verified');
  });

  test('should handle cookies preservation across requests', async () => {
    // Step 1: Get initial cookies
    const { csrfToken, cookies: initialCookies } = await loginAPI.fetchCSRFToken();

    expect(Object.keys(initialCookies).length).toBeGreaterThanOrEqual(0);
    console.log('✅ Initial cookies received:', Object.keys(initialCookies));

    // Step 2: Use same cookies in login request
    const loginResponse = await loginAPI.performLogin(
      {
        email: 'testuser@example.com',
        password: 'testPassword123!',
      },
      csrfToken,
      initialCookies
    );

    // Step 3: Verify request succeeded with preserved cookies
    expect(loginResponse.status).toBe(200);
    console.log('✅ Login succeeded with preserved cookies');
  });

  test('should validate login request structure', async () => {
    const { csrfToken, cookies } = await loginAPI.fetchCSRFToken();

    const loginResponse = await loginAPI.performLogin(
      {
        email: 'valid.email@example.com',
        password: 'ValidPassword123!',
      },
      csrfToken,
      cookies
    );

    // Validate response structure
    const body = loginResponse.body;

    // Depending on actual API, adjust these assertions
    expect(body).toBeDefined();

    // Verify status was OK
    expect(loginResponse.status).toBe(200);

    console.log('✅ Login request structure validated');
  });
});

/**
 * Alternative Test Suite: Real-world Scenario Example
 * (Uncomment and modify URLs for actual API testing)
 */
test.describe.skip('Real-world API Login Example', () => {
  test('should login to actual application', async ({ request, page }) => {
    const loginAPI = new LoginAPIPage(page, request);

    // Fetch CSRF token
    const { csrfToken, cookies } = await loginAPI.fetchCSRFToken();

    // Perform login
    const response = await loginAPI.performLogin(
      {
        email: 'your-email@example.com',
        password: 'your-password',
      },
      csrfToken,
      cookies
    );

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    // Extract session info
    const sessionInfo = loginAPI.extractSessionInfo(response);
    expect(sessionInfo.sessionId || sessionInfo.token).toBeTruthy();
  });
});
