import { test, expect } from '@playwright/test';

test.describe('Mobile Todo App', () => {
  // iPhone X viewport size
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load and display correctly on mobile viewport', async ({ page }) => {
    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBe(clientWidth);

    // Verify input is visible and accessible
    const input = page.locator('input[placeholder*="What needs"]');
    await expect(input).toBeVisible();

    // Verify add button is visible
    const addButton = page.locator('button:has-text("Add")');
    await expect(addButton).toBeVisible();
  });

  test('should create todo via mobile keyboard interaction', async ({ page }) => {
    const input = page.locator('input[placeholder*="What needs"]');

    // Type a todo with unique name
    const todoText = `Test mobile todo ${Date.now()}`;
    await input.fill(todoText);

    // Verify input has correct attributes for mobile
    await expect(input).toHaveAttribute('autocomplete', 'off');
    await expect(input).toHaveAttribute('enterkeyhint', 'done');

    // Submit via Enter key
    await input.press('Enter');

    // Verify todo was created using first() to avoid strict mode issues
    const createdTodo = page.locator('li').filter({ hasText: todoText }).first();
    await expect(createdTodo).toBeVisible();
  });

  test('should have adequate touch targets for all interactive elements', async ({ page }) => {
    // Create a todo first
    await page.locator('input[placeholder*="What needs"]').fill('Touch target test');
    await page.locator('button:has-text("Add")').click();

    // Verify add button touch target (minimum 44x44px)
    const addButton = page.locator('button:has-text("Add")');
    const addButtonBox = await addButton.boundingBox();
    expect(addButtonBox).not.toBeNull();
    if (addButtonBox) {
      expect(addButtonBox.height).toBeGreaterThanOrEqual(44);
    }

    // Verify checkbox touch target area (including wrapper padding)
    const checkboxWrapper = page.locator('li').first().locator('div').first();
    const checkboxBox = await checkboxWrapper.boundingBox();
    expect(checkboxBox).not.toBeNull();
    if (checkboxBox) {
      expect(checkboxBox.width).toBeGreaterThanOrEqual(44);
      expect(checkboxBox.height).toBeGreaterThanOrEqual(44);
    }

    // Verify delete button touch target
    const deleteButton = page.locator('button:has-text("Delete")').first();
    const deleteButtonBox = await deleteButton.boundingBox();
    expect(deleteButtonBox).not.toBeNull();
    if (deleteButtonBox) {
      expect(deleteButtonBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('should toggle todo completion via touch', async ({ page }) => {
    // Create a todo
    const input = page.locator('input[placeholder*="What needs"]');
    const addButton = page.locator('button:has-text("Add")');
    
    const todoText = `Toggle test ${Date.now()}`;
    await input.fill(todoText);
    
    // Wait for the todo to be created
    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/todos') && response.request().method() === 'POST'),
      addButton.click(),
    ]);

    // Wait for the UI to update
    await page.waitForTimeout(200);

    // Find the specific todo we just created
    const todoItem = page.locator('li').filter({ hasText: todoText }).first();
    const checkbox = todoItem.locator('input[type="checkbox"]');
    const span = todoItem.locator('span').first();
    
    // Toggle to completed
    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/todos/') && response.request().method() === 'PATCH'),
      checkbox.click(),
    ]);

    // Wait for UI to reflect completed state
    await expect(span).toHaveClass(/line-through/);

    // Verify todo is marked complete
    let classes = await span.getAttribute('class');
    expect(classes).toContain('line-through');
    expect(classes).toContain('opacity-60');

    // Toggle back to uncompleted
    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/todos/') && response.request().method() === 'PATCH'),
      checkbox.click(),
    ]);

    // Wait for UI to reflect active state
    await expect(span).not.toHaveClass(/line-through/);

    // Verify todo is no longer complete
    classes = await span.getAttribute('class');
    expect(classes).not.toContain('line-through');
    expect(classes).toContain('text-gray-900');
  });

  test('should delete todo via touch', async ({ page }) => {
    // Create a todo with unique name
    const input = page.locator('input[placeholder*="What needs"]');
    const addButton = page.locator('button:has-text("Add")');
    
    const todoText = `Delete test ${Date.now()}`;
    await input.fill(todoText);
    
    // Wait for the todo to be created
    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/todos') && response.request().method() === 'POST'),
      addButton.click(),
    ]);

    // Wait for the UI to update
    await page.waitForTimeout(200);

    // Verify todo exists
    const todoItem = page.locator('li').filter({ hasText: todoText }).first();
    await expect(todoItem).toBeVisible();

    // Set up dialog handler to accept confirmation
    page.on('dialog', (dialog) => dialog.accept());

    // Click delete button and wait for deletion
    const deleteButton = todoItem.locator('button:has-text("Delete")');
    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/todos/') && response.request().method() === 'DELETE'),
      deleteButton.click(),
    ]);

    // Verify the specific todo was removed (wait for it to disappear)
    await expect(todoItem).not.toBeVisible();
  });

  test('should maintain layout integrity on narrow viewport (320px)', async ({ page }) => {
    // Set to narrowest target viewport (iPhone SE 1st gen)
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBe(clientWidth);

    // Verify input is still functional
    const input = page.locator('input[placeholder*="What needs"]');
    await expect(input).toBeVisible();
    
    // Create a todo to verify full workflow with unique name
    const todoText = `Narrow viewport test ${Date.now()}`;
    await input.fill(todoText);
    await page.locator('button:has-text("Add")').click();
    
    // Use filter to find the specific todo
    const createdTodo = page.locator('li').filter({ hasText: todoText }).first();
    await expect(createdTodo).toBeVisible();
  });

  test('should scale typography responsively', async ({ page }) => {
    // Test at mobile size (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const heading = page.locator('h1:has-text("My Todos")');
    const mobileSize = await heading.evaluate((el) => window.getComputedStyle(el).fontSize);

    // Test at tablet size (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const tabletSize = await heading.evaluate((el) => window.getComputedStyle(el).fontSize);

    // Verify heading scales up on larger screens
    expect(parseFloat(tabletSize)).toBeGreaterThanOrEqual(parseFloat(mobileSize));
  });

  test('should display completed todos with clear visual distinction', async ({ page }) => {
    // Create and complete a todo
    await page.locator('input[placeholder*="What needs"]').fill('Visual distinction test');
    await page.locator('button:has-text("Add")').click();
    
    const checkbox = page.locator('li').first().locator('input[type="checkbox"]');
    const todoText = page.locator('li').first().locator('span').first();
    
    // Wait for the toggle to complete
    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/todos/') && response.request().method() === 'PATCH'),
      checkbox.click(),
    ]);

    // Wait for UI to reflect completed state, then verify
    await expect(todoText).toHaveClass(/line-through/);

    // Verify completed todo has both line-through and reduced opacity
    const classes = await todoText.getAttribute('class');
    expect(classes).toContain('line-through');
    expect(classes).toContain('opacity-60');
    
    // Verify color class changed from gray-900 to gray-500
    expect(classes).toContain('text-gray-500');
    expect(classes).not.toContain('text-gray-900');
  });
});
