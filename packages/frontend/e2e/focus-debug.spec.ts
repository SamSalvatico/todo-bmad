import { test, expect } from '@playwright/test';
test('debug focus', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    label: document.activeElement?.getAttribute('aria-label'),
    hasFocus: document.hasFocus(),
    bodyIsFocused: document.activeElement === document.body,
  }));
  console.log('FOCUS DEBUG:', JSON.stringify(info));
});
