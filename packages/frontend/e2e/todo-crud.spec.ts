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

  test('full happy-path: EmptyState → create → toggle → delete → refresh persistence', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');

    // Clean up any existing todos first
    let existingTodos = page.locator('ul[aria-label="Todo list"] li');
    while (await existingTodos.count() > 0) {
      page.once('dialog', (dialog) => void dialog.accept());
      await existingTodos.first().locator('button:has-text("Delete")').click();
      await page.waitForTimeout(300);
    }

    // Verify EmptyState is shown
    const emptyState = page.locator('output:has-text("No todos yet")');
    await expect(emptyState).toBeVisible();

    // Create first todo
    const todo1 = `Happy1 ${Date.now()}`;
    await input.fill(todo1);
    await addBtn.click();
    await expect(page.locator('li').filter({ hasText: todo1 })).toBeVisible();

    // EmptyState should disappear
    await expect(emptyState).not.toBeVisible();

    // Create second todo
    const todo2 = `Happy2 ${Date.now()}`;
    await input.fill(todo2);
    await addBtn.click();
    await expect(page.locator('li').filter({ hasText: todo2 })).toBeVisible();

    // Toggle first todo to completed
    const firstItem = page.locator('li').filter({ hasText: todo1 });
    const firstCheckbox = firstItem.locator('input[type="checkbox"]');
    await firstCheckbox.click();
    await page.waitForTimeout(300);
    await expect(firstCheckbox).toBeChecked();
    await expect(firstItem.locator('span').first()).toHaveClass(/line-through/);

    // Delete second todo
    const secondItem = page.locator('li').filter({ hasText: todo2 });
    page.once('dialog', (dialog) => void dialog.accept());
    await secondItem.locator('button:has-text("Delete")').click();
    await page.waitForTimeout(300);
    await expect(secondItem).not.toBeVisible();

    // Refresh page and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // First todo should persist with completed state
    const persistedItem = page.locator('li').filter({ hasText: todo1 });
    await expect(persistedItem).toBeVisible();
    await expect(persistedItem.locator('input[type="checkbox"]')).toBeChecked();
    await expect(persistedItem.locator('span').first()).toHaveClass(/line-through/);

    // Second todo should still be gone
    await expect(page.locator('li').filter({ hasText: todo2 })).not.toBeVisible();
  });

  test('multi-state persistence: create 3, complete 1, delete 1, verify after refresh', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addBtn = page.locator('button:has-text("Add")');
    const ts = Date.now();
    const todoA = `PersistA ${ts}`;
    const todoB = `PersistB ${ts}`;
    const todoC = `PersistC ${ts}`;

    // Create 3 todos
    for (const text of [todoA, todoB, todoC]) {
      await input.fill(text);
      await addBtn.click();
      await expect(page.locator('li').filter({ hasText: text })).toBeVisible();
      await page.waitForTimeout(100);
    }

    // Complete todoA
    const itemA = page.locator('li').filter({ hasText: todoA });
    await itemA.locator('input[type="checkbox"]').click();
    await page.waitForTimeout(300);
    await expect(itemA.locator('input[type="checkbox"]')).toBeChecked();

    // Delete todoB
    const itemB = page.locator('li').filter({ hasText: todoB });
    page.once('dialog', (dialog) => void dialog.accept());
    await itemB.locator('button:has-text("Delete")').click();
    await page.waitForTimeout(300);
    await expect(itemB).not.toBeVisible();

    // Refresh
    await page.reload();
    await page.waitForLoadState('networkidle');

    // todoA: visible, completed
    const reloadedA = page.locator('li').filter({ hasText: todoA });
    await expect(reloadedA).toBeVisible();
    await expect(reloadedA.locator('input[type="checkbox"]')).toBeChecked();

    // todoB: gone
    await expect(page.locator('li').filter({ hasText: todoB })).not.toBeVisible();

    // todoC: visible, uncompleted
    const reloadedC = page.locator('li').filter({ hasText: todoC });
    await expect(reloadedC).toBeVisible();
    await expect(reloadedC.locator('input[type="checkbox"]')).not.toBeChecked();

    // Verify order is created_at DESC — todoC (newest) should be before todoA (oldest)
    const allItems = page.locator('ul[aria-label="Todo list"] li');
    const texts = await allItems.allTextContents();
    const indexC = texts.findIndex((t) => t.includes(todoC));
    const indexA = texts.findIndex((t) => t.includes(todoA));
    expect(indexC).toBeLessThan(indexA);
  });
});
