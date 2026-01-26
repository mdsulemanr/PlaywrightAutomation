import {test, expect} from '@playwright/test';

// Calendar date picker handling
test('Calendar date picker handling', async ({browser})=> {
    const context = await browser.newContext();
    const page = await context.newPage();
    const dateToSelect = '15';
    const monthToSelect = 'April';
    const yearToSelect = '2024';


    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
    // Open calendar date picker
    await page.locator('.react-date-picker__calendar-button__icon.react-date-picker__button__icon').click();
    // Click on month-year label to open year selection
    await page.locator('.react-calendar__navigation__label__labelText').click();
    // Click on the Year to open year selection
    await page.locator('.react-calendar__navigation__label').click();
    // Select the desired year
    await page.locator('.react-calendar__decade-view__years__year').filter({hasText: yearToSelect}).click();
    // Select the desired month
    await page.locator('.react-calendar__year-view__months__month').filter({hasText: monthToSelect}).click();
    // Select the desired date
    await page.locator('.react-calendar__month-view__days__day').filter({hasText: dateToSelect}).click();
    
    // Verify the selected month is reflected in the input field
    const selectedMonthLocator = page.locator('.react-date-picker__inputGroup__month');
    // Calendar input stores month as numeric (e.g., "4" for April), convert the month name to its numeric value before asserting
    const monthNumber = String(new Date(`${monthToSelect} 1, ${yearToSelect}`).getMonth() + 1);
    await expect(selectedMonthLocator).toHaveValue(monthNumber);
    // new Date("April 1, 2024")
    // JavaScript understands this string and creates a date object:

    // → April 1st, 2024

    // 2. Extract the month (0-based)
    // .getMonth()
    // In JavaScript:

    // Month	getMonth() returns
    // January	0
    // February	1
    // March	2
    // April	3
    // May	4
    // December	11

    // new Date("April 1, 2024").getMonth(); // 3


    // Verify the selected date is reflected in the input field
    const selectedDateLocator = page.locator('.react-date-picker__inputGroup__day');
    await expect(selectedDateLocator).toHaveValue(dateToSelect);

    // Verify the selected year is reflected in the input field
    const selectedYearLocator = page.locator('.react-date-picker__inputGroup__year');
    await expect(selectedYearLocator).toHaveValue(yearToSelect);

    await page.waitForTimeout(2000); // just to visually see the year selection before proceeding
});

// Calendar date picker handling - refined version
test('Calendar date picker handling - refined version', async ({ page }) => {

    const dateToSelect = '15';
    const monthToSelect = 'April';
    const yearToSelect = '2024';

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

    // Open the calendar
    await page.locator('.react-date-picker__calendar-button__icon').click();

    // ---------------------------
    // STEP 1 — Open month-year view
    // ---------------------------
    await page.locator('.react-calendar__navigation__label').click();        // from month → year level
    await page.locator('.react-calendar__navigation__label').click();        // from year → decade level

    // ---------------------------
    // STEP 2 — Select year
    // ---------------------------
    await page
    .locator('.react-calendar__decade-view__years__year')
    .filter({ hasText: yearToSelect })
    .click();

    // ---------------------------
    // STEP 3 — Select month
    // ---------------------------
    await page
    .locator('.react-calendar__year-view__months__month')
    .filter({ hasText: monthToSelect })
    .click();

    // ---------------------------
    // STEP 4 — Select date
    // ---------------------------
    await page
    .locator('.react-calendar__month-view__days__day')
    .filter({ hasText: dateToSelect })
    .click();

    const hiddenDate = page.locator('input[name="date"]');
    await expect(hiddenDate).toHaveValue('2024-04-15');


  await page.waitForTimeout(1500);
});

// Calendar date picker handling - alternative version with getAttribute('value')
test.only('Calendar date picker handling - alternative version with getAttribute("value")', async ({ page }) => {

    const dateToSelect = '15';
    const monthToSelect = 'April';
    const yearToSelect = '2024';

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

    // Open the calendar
    await page.locator('.react-date-picker__calendar-button__icon').click();

    // ---------------------------
    // STEP 1 — Open month-year view
    // ---------------------------
    await page.locator('.react-calendar__navigation__label').click();        // from month → year level
    await page.locator('.react-calendar__navigation__label').click();        // from year → decade level

    // ---------------------------
    // STEP 2 — Select year
    // ---------------------------
    await page
    .locator('.react-calendar__decade-view__years__year')
    .filter({ hasText: yearToSelect })
    .click();

    // ---------------------------
    // STEP 3 — Select month
    // ---------------------------
    await page
    .locator('.react-calendar__year-view__months__month')
    .filter({ hasText: monthToSelect })
    .click();

    // ---------------------------
    // STEP 4 — Select date
    // ---------------------------
    await page
    .locator('.react-calendar__month-view__days__day')
    .filter({ hasText: dateToSelect })
    .click();

    // Verify the selected month is reflected in the input field
    const selectedMonthValue = await page.locator('.react-date-picker__inputGroup__month').getAttribute('value');
    const monthNumber = String(new Date(`${monthToSelect} 1, ${yearToSelect}`).getMonth() + 1);
    expect(selectedMonthValue).toBe(monthNumber);
    expect(selectedMonthValue).toEqual(monthNumber);
    // Verify the selected date is reflected in the input field
    const selectedDateValue = await page.locator('.react-date-picker__inputGroup__day').getAttribute('value');
    expect(selectedDateValue).toBe(dateToSelect);
    expect(selectedDateValue).toEqual(dateToSelect);
    // Verify the selected year is reflected in the input field
    const selectedYearValue = await page.locator('.react-date-picker__inputGroup__year').getAttribute('value');
    expect(selectedYearValue).toBe(yearToSelect);
    expect(selectedYearValue).toEqual(yearToSelect);
    console.log('Selected Date:', `${selectedYearValue}-${selectedMonthValue}-${selectedDateValue}`);


  await page.waitForTimeout(1500);
});
