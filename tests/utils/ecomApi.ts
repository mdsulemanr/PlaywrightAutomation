import type { APIRequestContext } from '@playwright/test';

export type LoginResponse = {
  token: string;
  userId: string;
  message: string;
};

export type CreateOrderResponse = {
  orders: string[];
  productOrderId: string;
  message: string;
};

export class EcomApi {
    
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseApiUrl: string = 'https://rahulshettyacademy.com/api/ecom'
  ) {}

  private get loginUrl() {
    return `${this.baseApiUrl}/auth/login`;
  }

  private get createOrderUrl() {
    return `${this.baseApiUrl}/order/create-order`;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await this.request.post(this.loginUrl, {
      data: { userEmail: email, userPassword: password },
      headers: {
        referer: 'https://rahulshettyacademy.com/client/',
        'content-type': 'application/json',
      },
    });

    if (!res.ok()) {
      throw new Error(`Login failed: ${res.status()} ${await res.text()}`);
    }

    const body = (await res.json()) as Partial<LoginResponse>;

    if (!body.token) {
      throw new Error(`Login response missing token. Body: ${JSON.stringify(body)}`);
    }

    return body as LoginResponse;
  }

  async createOrder(
    token: string,
    country: string,
    productOrderedId: string
  ): Promise<CreateOrderResponse> {
    const res = await this.request.post(this.createOrderUrl, {
      data: {
        orders: [{ country, productOrderedId }],
      },
      headers: {
        Authorization: token,
        'content-type': 'application/json',
      },
    });

    if (!res.ok()) {
      throw new Error(`Create order failed: ${res.status()} ${await res.text()}`);
    }

    const body = (await res.json()) as Partial<CreateOrderResponse>;

    if (!body.orders?.length) {
      throw new Error(`Create order response missing orders[]. Body: ${JSON.stringify(body)}`);
    }

    return body as CreateOrderResponse;
  }
}
