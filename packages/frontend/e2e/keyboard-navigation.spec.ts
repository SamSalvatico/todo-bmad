import { test, expect } from '@playwright/test';

// Run keyboard tests serially since they depend on Tab order and shared DB state
test.describe.configure({ mode: 'serial' });

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('My Todos');
  });

  test('input has focus on page load', async ({ page }) => {
    const input = page.locator('input[aria-label="New todo"]');
    await expect(input).toBeFocused();
  });

  test('Tab moves through interactive elements in correct order', async ({ page }) => {
    // Create two todos so we have interactive elements to tab through
    const input = page.locator('input[aria-label="New todo"]');
    const suffix = Date.now();
    await input.fill(`Tab test A ${suffix}`);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    await input.fill(`Tab test B ${suffix}`);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Type something in input to enable submit button for full tab order test
    await input.focus();
    await page.keyboard.type('test');
    await expect(input).toBeFocused();

    // Tab → submit button (enabled because input has value)
    await page.keyboard.press('Tab');
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();

    // Tab → first todo checkbox
    await page.keyboard.press('Tab');
    const firstCheckbox = page.locator('ul[aria-label="Todo list"] li').first().locator('input[type="checkbox"]');
    await expect(firstCheckbox).toBeFocused();

    // Tab → first todo delete button
    await page.keyboard.press('Tab');
    const firstDelete = page.locator('ul[aria-label="Todo list"] li').first().locator('button');
    await expect(firstDelete).toBeFocused();

    // Tab → second todo checkbox
    await page.keyboard.press('Tab');
    const secondCheckbox = page.locator('ul[aria-label="Todo list"] li').nth(1).locator('input[type="checkbox"]');
    await expect(secondCheckbox).toBeFocused();

    // Tab → second todo delete button
    await page.keyboard.press('Tab');
    const secondDelete = page.locator('ul[aria-label="Todo list"] li').nth(1).locator('button');
    await expect(secondDelete).toBeFocused();

    // Clean up: delete the test todos
    for (const text of [`Tab test A ${suffix}`, `Tab test B ${suffix}`]) {
      const item = page.locator('li').filter({ hasText: text });
      if (await item.isVisible()) {
        page.once('dialog', (dialog) => void dialog.accept());
        await item.locator('button').click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('Enter creates todo from input', async ({ page }) => {
    const todoText = `Keyboard create ${Date.now()}`;
    const input = page.locator('input[aria-label="New todo"]');

    await input.fill(todoText);
    await page.keyboard.press('Enter');

    await expect(page.locator('li').filter({ hasText: todoText })).toBeVisible();
    // Input should be cleared after successful creation
    await expect(input).toHaveValue('');

    // Clean up
    page.once('dialog', (dialog) => void dialog.accept());
    await page.locator('li').filter({ hasText: todoText }).locator('button').click();
    await page.waitForTimeout(300);
  });

  test('Space toggles checkbox when focused', async ({ page }) => {
    const todoText = `Space toggle ${Date.now()}`;
    const input = page.locator('input[aria-label="New todo"]');

    // Create a todo
    await input.fill(todoText);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Focus checkbox directly then use Space
    const checkbox = page.locator('ul[aria-label="Todo list"] li').filter({ hasText: todoText }).locator('input[type="checkbox"]');
    await checkbox.focus();
    await expect(checkbox).toBeFocused();
    await expect(checkbox).not.toBeChecked();

    // Press Space to toggle
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    await expect(checkbox).toBeChecked();

    // Press Space again to untoggle
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    await expect(checkbox).not.toBeChecked();

    // Clean up
    page.once('dialog', (dialog) => void dialog.accept());
    await page.locator('li').filter({ hasText: todoText }).locator('button').click();
    await page.waitForTimeout(300);
  });

  test('Enter on delete button deletes todo', async ({ page }) => {
    const todoText = `Delete via Enter ${Date.now()}`;
    const input = page.locator('input[aria-label="New todo"]');

    // Create a todo
    await input.fill(todoText);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const todoItem = page.locator('li').filter({ hasText: todoText });
    await expect(todoItem).toBeVisible();

    // Focus delete button directly, then use Enter
    const deleteBtn = todoItem.locator('button');
    await deleteBtn.focus();
    await expect(deleteBtn).toBeFocused();

    // Accept the confirm dialog
    page.once('dialog', (dialog) => void dialog.accept());
    await page.keyboard.press('Enter');

    await page.waitForTimeout(500);
    await expect(todoItem).not.toBeVisible();
  });

  test('focus moves to next todo checkbox after deletion', async ({ page }) => {
    const input = page.locator('input[aria-label="New todo"]');
    const suffix = Date.now();

    // Create two todos
    const todoA = `Focus A ${suffix}`;
    const todoB = `Focus B ${suffix}`;

    await input.fill(todoA);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    await input.fill(todoB);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Focus first todo's delete button directly
    const firstTodo = page.locator('li').filter({ hasText: todoA });
    const firstDeleteBtn = firstTodo.locator('button');
    await firstDeleteBtn.focus();

    // Delete first todo
    page.once('dialog', (dialog) => void dialog.accept());
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Focus should move to next todo's checkbox (todoB, now the first item)
    const remainingCheckbox = page.locator('li').filter({ hasText: todoB }).locator('input[type="checkbox"]');
    await expect(remainingCheckbox).toBeFocused();

    // Clean up
    page.once('dialog', (dialog) => void dialog.accept());
    await page.locator('li').filter({ hasText: todoB }).locator('button').click();
    await page.waitForTimeout(300);
  });

  test('focus moves to input when last todo is deleted', async ({ page }) => {
    const input = page.locator('input[aria-label="New todo"]');

    // First, clean up any existing todos
    let existingTodos = page.locator('ul[aria-label="Todo list"] li');
    while (await existingTodos.count() > 0) {
      page.once('dialog', (dialog) => void dialog.accept());
      await existingTodos.first().locator('button').click();
      await page.waitForTimeout(300);
    }

    // Create a single todo
    const todoText = `Last todo ${Date.now()}`;
    await input.fill(todoText);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Focus delete button directly
    const todoItem = page.locator('li').filter({ hasText: todoText });
    const deleteBtn = todoItem.locator('button');
    await deleteBtn.focus();

    // Delete the only todo
    page.once('dialog', (dialog) => void dialog.accept());
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Focus should move back to input
    await expect(input).toBeFocused();
  });

  test('all operations work without mouse', async ({ page }) => {
    const input = page.locator('input[aria-label="New todo"]');

    // 1. Create todo via keyboard only (focus starts on input)
    const todoText = `No mouse ${Date.now()}`;
    await page.keyboard.type(todoText);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const todoItem = page.locator('li').filter({ hasText: todoText });
    await expect(todoItem).toBeVisible();
    await expect(input).toHaveValue('');

    // 2. Toggle via keyboard: focus checkbox, Space to toggle
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await checkbox.focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    await expect(checkbox).toBeChecked();

    // 3. Verify completed style
    const todoSpan = todoItem.locator('span').first();
    await expect(todoSpan).toHaveClass(/line-through/);

    // 4. Delete via keyboard: Tab from checkbox to delete, Enter
    await page.keyboard.press('Tab'); // delete button (next sibling)
    page.once('dialog', (dialog) => void dialog.accept());
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    await expect(todoItem).not.toBeVisible();
  });
});
