import { expect, test } from '@playwright/test';

test.describe('UI States', () => {
  test('LoadingSpinner appears on initial load then disappears', async ({ page }) => {
    // Delay the API response to observe the loading spinner
    await page.route('**/api/todos', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto('/');

    // Spinner should be visible while waiting
    const spinner = page.locator('[role="status"]:has-text("Loading")');
    await expect(spinner).toBeVisible();

    // After response arrives, spinner should disappear and main content shows
    await expect(page.locator('h1')).toContainText('My Todos', { timeout: 10000 });
    await expect(spinner).not.toBeVisible();
  });

  test('EmptyState shows when no todos exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Clean up any existing todos
    let existingTodos = page.locator('ul[aria-label="Todo list"] li');
    while (await existingTodos.count() > 0) {
      page.once('dialog', (dialog) => void dialog.accept());
      await existingTodos.first().locator('button:has-text("Delete")').click();
      await page.waitForTimeout(300);
    }

    // Verify EmptyState with implicit role="status" (<output> element)
    const emptyState = page.locator('output:has-text("No todos yet")');
    await expect(emptyState).toBeVisible();
  });

  test('ErrorMessage can be dismissed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Block POST to trigger error
    await page.route('**/api/todos', (route) => {
      if (route.request().method() === 'POST') {
        return route.abort();
      }
      return route.continue();
    });

    const input = page.locator('input[placeholder="What needs to be done?"]');
    await input.fill(`Dismiss test ${Date.now()}`);
    await page.locator('button:has-text("Add")').click();

    // Error should appear
    const errorAlert = page.locator('[role="alert"]');
    await expect(errorAlert).toBeVisible();

    // Click dismiss
    await page.locator('button[aria-label="Dismiss error"]').click();

    // Error should disappear
    await expect(errorAlert).not.toBeVisible();
  });

  test('app recovers from error state to normal operations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Block POST to cause error
    await page.route('**/api/todos', (route) => {
      if (route.request().method() === 'POST') {
        return route.abort();
      }
      return route.continue();
    });

    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    await input.fill('Error recovery test');
    await addBtn.click();
    await expect(page.locator('[role="alert"]')).toBeVisible();

    // Unblock and dismiss
    await page.unroute('**/api/todos');
    await page.locator('button[aria-label="Dismiss error"]').click();
    await expect(page.locator('[role="alert"]')).not.toBeVisible();

    // Normal create should work
    const todoText = `Recovered ${Date.now()}`;
    await input.clear();
    await input.fill(todoText);
    await addBtn.click();
    const todoItem = page.locator('li').filter({ hasText: todoText });
    await expect(todoItem).toBeVisible();

    // Normal toggle should work
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await checkbox.click();
    await page.waitForTimeout(300);
    await expect(checkbox).toBeChecked();

    // Normal delete should work
    page.once('dialog', (dialog) => void dialog.accept());
    await todoItem.locator('button:has-text("Delete")').click();
    await page.waitForTimeout(300);
    await expect(todoItem).not.toBeVisible();
  });
});
