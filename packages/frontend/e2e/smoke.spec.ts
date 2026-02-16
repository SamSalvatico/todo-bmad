import { expect, test } from '@playwright/test';

test('app loads successfully', async ({ page }) => {
  await page.goto('/');

  // Verify the page loaded
  await expect(page).toHaveTitle(/Todo/i);

  // Verify React app rendered
  const heading = page.getByText(/todo app/i);
  await expect(heading).toBeVisible();
});
