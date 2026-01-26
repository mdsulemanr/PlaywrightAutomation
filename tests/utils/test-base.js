import { test } from '@playwright/test';


export const customtest = test.extend(
    {

        testData: {
            username: "rahulshettyacademy",
            password: "Learning@830$3mK2"
        }
    }
)