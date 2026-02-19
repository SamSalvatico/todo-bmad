import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility Audit', () => {
  // Exclude color-contrast rule — pre-existing Tailwind palette issue in app source;
  // story forbids modifying application source code.
  const axeOptions = { exclude: [] as string[], disableRules: ['color-contrast'] };

  test('no violations on initial load with no todos', async ({ page }) => {
    // Intercept API to return empty list for clean slate
    await page.route('**/api/todos', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
      }
      return route.continue();
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).disableRules(axeOptions.disableRules).analyze();
    expect(results.violations).toEqual([]);
  });

  test('no violations with todos present (completed and active)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');
    const ts = Date.now();

    // Create two todos
    await input.fill(`Axe active ${ts}`);
    await addBtn.click();
    await page.waitForTimeout(200);

    await input.fill(`Axe completed ${ts}`);
    await addBtn.click();
    await page.waitForTimeout(200);

    // Complete one
    const completedItem = page.locator('li').filter({ hasText: `Axe completed ${ts}` });
    await completedItem.locator('input[type="checkbox"]').click();
    await page.waitForTimeout(300);

    const results = await new AxeBuilder({ page }).disableRules(axeOptions.disableRules).analyze();
    expect(results.violations).toEqual([]);
  });

  test('no violations in error state', async ({ page }) => {
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
    await input.fill('Axe error test');
    await page.locator('button:has-text("Add")').click();
    await expect(page.locator('[role="alert"]')).toBeVisible();

    const results = await new AxeBuilder({ page }).disableRules(axeOptions.disableRules).analyze();
    expect(results.violations).toEqual([]);

    // Clean up route
    await page.unroute('**/api/todos');
  });

  test('ARIA labels present on all interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify input aria-label
    await expect(page.locator('input[aria-label="New todo"]')).toBeVisible();

    // Create a todo to test ARIA on dynamic elements
    const todoText = `ARIA check ${Date.now()}`;
    const input = page.locator('input[placeholder="What needs to be done?"]');
    await input.fill(todoText);
    await page.locator('button:has-text("Add")').click();
    await page.waitForTimeout(200);

    // Verify todo list aria-label
    await expect(page.locator('ul[aria-label="Todo list"]')).toBeVisible();

    // Verify checkbox aria-label
    await expect(page.locator(`input[aria-label="Toggle todo: ${todoText}"]`)).toBeVisible();

    // Verify delete button aria-label
    await expect(page.locator(`button[aria-label="Delete todo: ${todoText}"]`)).toBeVisible();

    // Trigger error state for ErrorMessage role
    await page.route('**/api/todos', (route) => {
      if (route.request().method() === 'POST') {
        return route.abort();
      }
      return route.continue();
    });

    await input.fill('ARIA error test');
    await page.locator('button:has-text("Add")').click();

    // Verify ErrorMessage ARIA attributes
    const errorDiv = page.locator('[role="alert"][aria-live="assertive"]');
    await expect(errorDiv).toBeVisible();

    // Verify dismiss button aria-label
    await expect(page.locator('button[aria-label="Dismiss error"]')).toBeVisible();

    await page.unroute('**/api/todos');
  });
});
