import { expect, test } from '@playwright/test';

test.describe('landing page', () => {
  test('renders the primary landing content and routes the hero login CTA', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'PIDEC 1.0' })).toBeVisible();
    await expect(
      page.getByText('Engineering for Impact: Building Inclusive Solutions for a Sustainable Future').first(),
    ).toBeVisible();
    await expect(page.getByText('10').first()).toBeVisible();
    await expect(page.getByText('Departments').first()).toBeVisible();
    await expect(page.getByText('July 4, 2026')).toBeVisible();

    await page.getByRole('link', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in to PIDEC 1.0' })).toBeVisible();
  });

  test('animates mobile navigation open, navigates, and closes after a tab click', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const header = page.locator('header');

    await header.getByRole('button', { name: 'Open menu' }).click();
    await expect(header.getByRole('link', { name: 'Stages' })).toBeVisible();

    await header.getByRole('link', { name: 'Stages' }).click();

    await expect(page).toHaveURL(/#stages$/);
    await expect(header.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });
});
