import { test, expect } from '@playwright/test';

test.describe('Todo CRUD Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('My Todos');
  });

  test('should load page and display heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('My Todos');
    
    const input = page.locator('input[placeholder="What needs to be done?"]');
    await expect(input).toBeVisible();
  });

  test('should create a new todo', async ({ page }) => {
    const todoText = `E2E Test ${Date.now()}`;
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    await input.fill(todoText);
    await addBtn.click();

    // Use filter to find the specific todo
    const todoItem = page.locator('li').filter({ hasText: todoText });
    await expect(todoItem).toBeVisible();
    
    await expect(input).toHaveValue('');
  });

  test('should toggle completion state', async ({ page }) => {
    const todoText = `Toggle ${Date.now()}`;
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    // Create todo
    await input.fill(todoText);
    await addBtn.click();

    // Find the todo item and its checkbox
    const todoItem = page.locator('li').filter({ hasText: todoText });
    const checkbox = todoItem.locator('input[type="checkbox"]');
    const todoSpan = todoItem.locator('span').first();

    // Initially unchecked
    const wasChecked = await checkbox.isChecked();
    
    // Click checkbox
    await checkbox.click();
    
    // Wait for state to update
    await page.waitForTimeout(300);
    
    // Verify state changed
    const isCheckedNow = await checkbox.isChecked();
    expect(isCheckedNow).toBe(!wasChecked);
    
    // Verify visual style changed
    if (!wasChecked) {
      // Should now have line-through
      const classes = await todoSpan.getAttribute('class');
      expect(classes).toContain('line-through');
    }
  });

  test('should delete a todo', async ({ page }) => {
    const todoText = `Delete ${Date.now()}`;
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    // Create todo
    await input.fill(todoText);
    await addBtn.click();

    // Verify it exists
    const todoItem = page.locator('li').filter({ hasText: todoText });
    await expect(todoItem).toBeVisible();

    // Delete it
    page.once('dialog', (dialog) => void dialog.accept());
    const deleteBtn = todoItem.locator('button:has-text("Delete")');
    await deleteBtn.click();

    // Verify it's gone
    await page.waitForTimeout(300);
    await expect(todoItem).not.toBeVisible();
  });

  test('should persist todos across reload', async ({ page }) => {
    const todoText = `Persist ${Date.now()}`;
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    // Create todo
    await input.fill(todoText);
    await addBtn.click();

    const todoItem = page.locator('li').filter({ hasText: todoText });
    await expect(todoItem).toBeVisible();

    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify it persisted
    const reloadedTodo = page.locator('li').filter({ hasText: todoText });
    await expect(reloadedTodo).toBeVisible();
  });

  test('should validate empty input', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    await input.clear();
    expect(await addBtn.isDisabled()).toBe(true);

    await input.fill('Valid input');
    expect(await addBtn.isDisabled()).toBe(false);
  });

  test('complete workflow: create, mark done, delete', async ({ page }) => {
    const timestamp = Date.now();
    const todos = [`Task1 ${timestamp}`, `Task2 ${timestamp}`, `Task3 ${timestamp}`];

    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    // Create 3 todos
    for (const todo of todos) {
      await input.fill(todo);
      await addBtn.click();
      
      const item = page.locator('li').filter({ hasText: todo });
      await expect(item).toBeVisible();
      await page.waitForTimeout(100);
    }

    // Mark first as complete
    const firstTodo = page.locator('li').filter({ hasText: todos[0] });
    const firstCheckbox = firstTodo.locator('input[type="checkbox"]');
    await firstCheckbox.click();
    
    // Wait for state update
    await page.waitForTimeout(300);
    
    const isChecked = await firstCheckbox.isChecked();
    expect(isChecked).toBe(true);

    // Delete second
    const secondTodo = page.locator('li').filter({ hasText: todos[1] });
    page.once('dialog', (dialog) => void dialog.accept());
    const deleteBtn = secondTodo.locator('button:has-text("Delete")');
    await deleteBtn.click();

    await page.waitForTimeout(300);

    // Verify state
    await expect(firstTodo).toBeVisible();
    await expect(secondTodo).not.toBeVisible();
    
    const thirdTodo = page.locator('li').filter({ hasText: todos[2] });
    await expect(thirdTodo).toBeVisible();
  });
});
