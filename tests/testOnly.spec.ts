import { test } from '@playwright/test'
 
let browserContext: any;
const useremail = '4255rk@gmail.com'
const password = 'Ninjalogin1@'
 
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://rahulshettyacademy.com/client/')
 
    // login
    await page.getByPlaceholder('email@example.com').fill(useremail)
    await page.getByPlaceholder('enter your passsword').fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
 
    await page.waitForLoadState('networkidle')
    await context.storageState({ path: 'state.json' }) // save the state to a file
    browserContext = await browser.newContext({ storageState: 'state.json' }) // load the state from the file
})
 
test('Login Using Storage State', async () => {
    const page = await browserContext.newPage() // create a new page from the browser context
    await page.goto('https://rahulshettyacademy.com/client/')
 
    await page.waitForLoadState('networkidle')
    await page.locator('//h5/b').first().waitFor()
 
    // Get the first product name
    const productName = await page.locator('//h5/b').allTextContents()
    console.log(productName)
 
    await page.close()
})