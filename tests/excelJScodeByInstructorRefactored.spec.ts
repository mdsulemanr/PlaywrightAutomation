import ExcelJS from 'exceljs';
import { test, expect } from '@playwright/test';

type Change = {
  rowChange?: number;
  colChange?: number;
};

type CellPos = {
  row: number;
  column: number;
};

async function writeExcelTest(
  searchText: string,
  replaceText: string | number,
  change: Change,
  filePath: string
): Promise<CellPos> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet('Sheet1');
  if (!worksheet) throw new Error('Sheet1 not found');

  const output = readExcel(worksheet, searchText);
  if (output.row === -1) throw new Error(`"${searchText}" not found in Excel`);

  const targetRow = output.row + (change.rowChange ?? 0);
  const targetCol = output.column + (change.colChange ?? 0);

  worksheet.getCell(targetRow, targetCol).value = replaceText;
  await workbook.xlsx.writeFile(filePath);

  return { row: targetRow, column: targetCol };
}

function readExcel(worksheet: ExcelJS.Worksheet, searchText: string): CellPos {
  let output: CellPos = { row: -1, column: -1 };

  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
      if (cell.text === searchText) {
        output = { row: rowNumber, column: colNumber };
      }
    });
  });

  return output;
}


import path from 'path';

test('Upload download excel validation', async ({ page }) => {
  const textSearch = 'Mango';
  const updateValue = '350';

  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;

  const filePath = path.join(process.cwd(), 'exceldownloadtest.xlsx');
  await download.saveAs(filePath);

  await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, filePath);

  await page.locator('#fileinput').setInputFiles(filePath);

  const desiredRow = page.getByRole('row').filter({ hasText: textSearch });
  await expect(desiredRow).toContainText(updateValue);
});
