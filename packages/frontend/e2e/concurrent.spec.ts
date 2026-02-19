import { expect, test } from '@playwright/test';

test.describe('Concurrent Operations', () => {
  test('two browser contexts see each others changes after refresh', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Both contexts navigate to the app
    await page1.goto('http://localhost:5173');
    await page1.waitForLoadState('networkidle');
    await page2.goto('http://localhost:5173');
    await page2.waitForLoadState('networkidle');

    const todoText = `Concurrent ${Date.now()}`;

    // Context 1: create a todo
    const input1 = page1.locator('input[placeholder="What needs to be done?"]');
    const addBtn1 = page1.locator('button:has-text("Add")');
    await input1.fill(todoText);
    await addBtn1.click();
    await expect(page1.locator('li').filter({ hasText: todoText })).toBeVisible();

    // Context 2: refresh to see the new todo
    await page2.reload();
    await page2.waitForLoadState('networkidle');
    const todoItem2 = page2.locator('li').filter({ hasText: todoText });
    await expect(todoItem2).toBeVisible();

    // Context 2: toggle completion
    const checkbox2 = todoItem2.locator('input[type="checkbox"]');
    await checkbox2.click();
    await page2.waitForTimeout(300);
    await expect(checkbox2).toBeChecked();

    // Context 1: refresh to see the toggle change
    await page1.reload();
    await page1.waitForLoadState('networkidle');
    const todoItem1 = page1.locator('li').filter({ hasText: todoText });
    await expect(todoItem1).toBeVisible();
    await expect(todoItem1.locator('input[type="checkbox"]')).toBeChecked();

    // Clean up
    await context1.close();
    await context2.close();
  });
});
