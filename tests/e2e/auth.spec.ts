import { expect, test } from '@playwright/test';

test.describe('authentication screens', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
        }),
      });
    });
    await page.route('**/auth/refresh', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { code: 'AUTH_REQUIRED', message: 'Refresh token missing' },
        }),
      });
    });
  });

  test('shows login form, toggles password visibility, and surfaces friendly API errors', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Invalid email or password. Please check your details and try again.',
          },
        }),
      });
    });

    await page.goto('/login');

    await expect(page.getByRole('heading', { name: 'Sign in to PIDEC 1.0' })).toBeVisible();
    await page.getByLabel('Email Address').fill('wrong@example.com');

    const password = page.getByPlaceholder('Enter your password');
    await password.fill('Wrongpass123');
    await expect(password).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(password).toHaveAttribute('type', 'text');

    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(
      page.getByText('Invalid email or password. Please check your details and try again.'),
    ).toBeVisible();
  });

  test('redirects unauthenticated protected pages to login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in to PIDEC 1.0' })).toBeVisible();
  });
});
