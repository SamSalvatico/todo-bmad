import { expect, test } from '@playwright/test';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('My Todos');
  });

  test('shows error on network failure and recovers after dismiss', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');
    const todoText = `Error test ${Date.now()}`;

    // Block all POST requests to /api/todos
    await page.route('**/api/todos', (route) => {
      if (route.request().method() === 'POST') {
        return route.abort();
      }
      return route.continue();
    });

    // Attempt to create a todo
    await input.fill(todoText);
    await addBtn.click();

    // Verify error message appears with role="alert"
    const errorAlert = page.locator('[role="alert"]');
    await expect(errorAlert).toBeVisible();

    // Unblock routes
    await page.unroute('**/api/todos');

    // Dismiss the error
    const dismissBtn = page.locator('button[aria-label="Dismiss error"]');
    await dismissBtn.click();
    await expect(errorAlert).not.toBeVisible();

    // Retry creation successfully
    await input.clear();
    await input.fill(todoText);
    await addBtn.click();
    await expect(page.locator('li').filter({ hasText: todoText })).toBeVisible();
  });

  test('preserves input text on failure and allows retry', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');
    const todoText = `Preserve input ${Date.now()}`;

    // Block POST requests
    await page.route('**/api/todos', (route) => {
      if (route.request().method() === 'POST') {
        return route.abort();
      }
      return route.continue();
    });

    // Fill input and attempt creation
    await input.fill(todoText);
    await addBtn.click();

    // Wait for error
    await expect(page.locator('[role="alert"]')).toBeVisible();

    // Verify input text is preserved
    await expect(input).toHaveValue(todoText);

    // Unblock and retry
    await page.unroute('**/api/todos');
    await page.locator('button[aria-label="Dismiss error"]').click();
    await addBtn.click();
    await expect(page.locator('li').filter({ hasText: todoText })).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('Add button is disabled when input is empty', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    // Ensure input is empty
    await input.clear();
    await expect(addBtn).toBeDisabled();

    // Type something — button should become enabled
    await input.fill('Valid input');
    await expect(addBtn).toBeEnabled();

    // Clear again — button disabled
    await input.clear();
    await expect(addBtn).toBeDisabled();
  });
});
