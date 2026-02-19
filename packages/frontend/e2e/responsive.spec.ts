import { expect, test } from '@playwright/test';

test.describe('Responsive — Tablet (768×1024)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('layout displays correctly at tablet viewport', async ({ page }) => {
    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBe(clientWidth);

    // Core elements visible
    await expect(page.locator('h1')).toContainText('My Todos');
    await expect(page.locator('input[placeholder*="What needs"]')).toBeVisible();
    await expect(page.locator('button:has-text("Add")')).toBeVisible();
  });

  test('full CRUD workflow at tablet viewport', async ({ page }) => {
    const input = page.locator('input[placeholder*="What needs"]');
    const addBtn = page.locator('button:has-text("Add")');
    const todoText = `Tablet CRUD ${Date.now()}`;

    // Create
    await input.fill(todoText);
    await addBtn.click();
    const item = page.locator('li').filter({ hasText: todoText });
    await expect(item).toBeVisible();

    // Toggle
    const checkbox = item.locator('input[type="checkbox"]');
    await checkbox.click();
    await page.waitForTimeout(300);
    await expect(checkbox).toBeChecked();

    // Delete
    page.once('dialog', (dialog) => void dialog.accept());
    await item.locator('button:has-text("Delete")').click();
    await page.waitForTimeout(300);
    await expect(item).not.toBeVisible();
  });

  test('touch targets ≥ 44px at tablet viewport', async ({ page }) => {
    // Create a todo for interactive elements
    await page.locator('input[placeholder*="What needs"]').fill('Tablet touch test');
    await page.locator('button:has-text("Add")').click();
    await page.waitForTimeout(200);

    // Add button
    const addBtnBox = await page.locator('button:has-text("Add")').boundingBox();
    expect(addBtnBox).not.toBeNull();
    if (addBtnBox) {
      expect(addBtnBox.height).toBeGreaterThanOrEqual(44);
    }

    // Checkbox wrapper
    const checkboxWrapper = page.locator('li').first().locator('div').first();
    const checkboxBox = await checkboxWrapper.boundingBox();
    expect(checkboxBox).not.toBeNull();
    if (checkboxBox) {
      expect(checkboxBox.width).toBeGreaterThanOrEqual(44);
      expect(checkboxBox.height).toBeGreaterThanOrEqual(44);
    }

    // Delete button
    const deleteBtnBox = await page.locator('button:has-text("Delete")').first().boundingBox();
    expect(deleteBtnBox).not.toBeNull();
    if (deleteBtnBox) {
      expect(deleteBtnBox.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Responsive — Desktop (1920×1080)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('layout displays correctly at desktop viewport', async ({ page }) => {
    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBe(clientWidth);

    await expect(page.locator('h1')).toContainText('My Todos');
    await expect(page.locator('input[placeholder*="What needs"]')).toBeVisible();
    await expect(page.locator('button:has-text("Add")')).toBeVisible();

    // Content should be constrained (max-w-2xl = 672px) — not stretched full width
    const container = page.locator('div.max-w-2xl');
    const containerBox = await container.boundingBox();
    expect(containerBox).not.toBeNull();
    if (containerBox) {
      expect(containerBox.width).toBeLessThanOrEqual(700); // max-w-2xl ~672px
    }
  });

  test('full CRUD workflow at desktop viewport', async ({ page }) => {
    const input = page.locator('input[placeholder*="What needs"]');
    const addBtn = page.locator('button:has-text("Add")');
    const todoText = `Desktop CRUD ${Date.now()}`;

    // Create
    await input.fill(todoText);
    await addBtn.click();
    const item = page.locator('li').filter({ hasText: todoText });
    await expect(item).toBeVisible();

    // Toggle
    const checkbox = item.locator('input[type="checkbox"]');
    await checkbox.click();
    await page.waitForTimeout(300);
    await expect(checkbox).toBeChecked();

    // Delete
    page.once('dialog', (dialog) => void dialog.accept());
    await item.locator('button:has-text("Delete")').click();
    await page.waitForTimeout(300);
    await expect(item).not.toBeVisible();
  });

  test('touch targets ≥ 44px at desktop viewport', async ({ page }) => {
    await page.locator('input[placeholder*="What needs"]').fill('Desktop touch test');
    await page.locator('button:has-text("Add")').click();
    await page.waitForTimeout(200);

    const addBtnBox = await page.locator('button:has-text("Add")').boundingBox();
    expect(addBtnBox).not.toBeNull();
    if (addBtnBox) {
      expect(addBtnBox.height).toBeGreaterThanOrEqual(44);
    }

    const deleteBtnBox = await page.locator('button:has-text("Delete")').first().boundingBox();
    expect(deleteBtnBox).not.toBeNull();
    if (deleteBtnBox) {
      expect(deleteBtnBox.height).toBeGreaterThanOrEqual(44);
    }
  });
});
