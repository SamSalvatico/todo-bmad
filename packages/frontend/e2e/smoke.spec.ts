import { expect, test } from '@playwright/test';

test('app loads successfully', async ({ page }) => {
  await page.goto('/');

  // Wait for network to be idle to ensure everything loaded
  await page.waitForLoadState('networkidle');

  // Verify the page title
  await expect(page).toHaveTitle(/Todo/i);

  // Verify React app rendered with My Todos heading
  const heading = page.locator('h1');
  await expect(heading).toContainText('My Todos');
});
