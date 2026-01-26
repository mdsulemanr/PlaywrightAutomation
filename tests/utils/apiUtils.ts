import { expect, type APIRequestContext} from '@playwright/test';

export class APIUtils {

    private readonly apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext){
        this.apiContext = apiContext;
    }

    token?: string;

    private readonly LOGIN_URL = 'https://rahulshettyacademy.com/api/ecom/auth/login';
    private readonly PAYLOAD = {
                        userEmail: "testertesty@gmail.com",
                        userPassword: "Testertesty!1"
                    };
    private readonly HEADERS = {
                    'referer': 'https://rahulshettyacademy.com/client/',
                    'Content-Type': 'application/json',
                    };

    private readonly country = "Indonesia";
    private readonly productOrderedId = "68a961719320a140fe1ca57c";

    async getToken(){

            const loginRespose = await this.apiContext.post(this.LOGIN_URL, {
                data: this.PAYLOAD,
                headers: this.HEADERS
            });
        
            if (!loginRespose.ok()) {
                throw new Error(`Login failed: ${loginRespose.status()} ${await loginRespose.text()}`);
            }

            expect(loginRespose.ok()).toBeTruthy();
            expect(loginRespose.status()).toBe(200);
            
            const responseBody = await loginRespose.json();
            expect(responseBody).toHaveProperty('token');
            expect(responseBody).toHaveProperty('message');
            expect(responseBody).toHaveProperty('userId');
            expect(responseBody.message).toBe("Login Successfully");

            this.token = responseBody.token;
            return this.token;
        
    }

    async createOrder(){
        if (!this.token) {
            throw new Error('Auth token is missing. Please login first to get the token.');
        }

        const orderHeaders = {
            'Authorization': this.token,
            'content-type': 'application/json'
        };

        const orderIdResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
            data: {
                orders: [{
                    country: this.country,
                    productOrderedId: this.productOrderedId
                }]
            },
            headers: orderHeaders
        });

        expect(orderIdResponse.ok()).toBeTruthy();
        expect(orderIdResponse.status()).toBe(201);

        const orderResponseBody = await orderIdResponse.json();
        expect(orderResponseBody).toHaveProperty('orders');
        expect(orderResponseBody).toHaveProperty('productOrderId');
        expect(orderResponseBody).toHaveProperty('message');
        expect(orderResponseBody.message).toBe("Order Placed Successfully");

        return orderResponseBody.orders[0];
    }

}

