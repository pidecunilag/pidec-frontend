import { expect, test } from '@playwright/test';

const registrationResponse = {
  success: true,
  data: {
    id: '17c1f237-e39d-420e-a8c0-9553a54e956c',
    registrationNumber: 'PIDEC26-00999',
    fullName: 'Teslim Ade',
    firstName: 'Teslim',
    email: 'teslim@example.com',
    phone: '+2348012345678',
    createdAt: '2026-08-20T12:00:00.000Z',
  },
};

test.describe('finale registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/public/finale/registrations', async (route) => {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(registrationResponse) });
    });
  });

  test('registers and downloads a populated square share card', async ({ page }, testInfo) => {
    await page.goto('/finale');

    await expect(page.getByRole('heading', { name: 'Register for the PIDEC 1.0 Grand Finale' })).toBeVisible();
    await expect(page.getByText('Friday, 28 August 2026')).toBeVisible();
    await expect(page.getByText('J.F. Ajayi Auditorium')).toBeVisible();

    await page.getByLabel('Full name').fill('Teslim Ade');
    await page.getByLabel('Email address').fill('teslim@example.com');
    await page.getByLabel('Phone number').fill('0801 234 5678');
    await page.getByRole('button', { name: 'Complete registration' }).click();

    await expect(page.getByText('Registration confirmed', { exact: true })).toBeVisible();
    await expect(page.getByText('PIDEC26-00999').first()).toBeVisible();
    await expect(page.getByText('Teslim', { exact: true })).toBeVisible();

    await page.getByLabel('Add a photo').setInputFiles('public/finale-poster.jpg');
    await expect(page.getByLabel('Photo position')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download PNG' }).click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(download.suggestedFilename()).toBe('Teslim-is-going-to-PIDEC-1.0.png');
    expect(path).toBeTruthy();

    const file = await import('node:fs/promises');
    const stat = await file.stat(path!);
    expect(stat.size).toBeGreaterThan(50_000);

    await page.screenshot({ path: testInfo.outputPath('finale-share-card.png'), fullPage: true });
  });

  test('keeps the registration form usable on mobile', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/finale');

    await expect(page.getByRole('heading', { name: 'Register for the PIDEC 1.0 Grand Finale' })).toBeVisible();
    await expect(page.getByLabel('Full name')).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath('finale-mobile.png'), fullPage: true });
  });
});

test.describe('finale admin', () => {
  test('shows metrics, searches attendees, and admits an attendee', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    let admittedAt: string | null = null;
    const attendee = () => ({
      id: '17c1f237-e39d-420e-a8c0-9553a54e956c',
      registrationNumber: 'PIDEC26-00021',
      fullName: 'Amina Bello',
      email: 'amina@example.com',
      phone: '+2348012223344',
      admittedAt,
      admittedBy: admittedAt ? 'cf0d58ce-8da8-49d7-9988-6c513ad142cd' : null,
      createdAt: '2026-08-20T12:00:00.000Z',
      updatedAt: '2026-08-20T12:00:00.000Z',
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('pidec:access_token', 'playwright-admin-token');
      window.localStorage.setItem('pidec:refresh_token', 'playwright-refresh-token');
    });
    await page.route('**/api/v1/auth/me**', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          user: {
            id: 'cf0d58ce-8da8-49d7-9988-6c513ad142cd',
            name: 'PIDEC Admin',
            email: 'admin@pidec.com.ng',
            matricNumber: '',
            department: '',
            level: 100,
            verificationStatus: 'verified',
            verificationMethod: 'manual',
            verificationTimestamp: '2026-01-01T00:00:00.000Z',
            verificationAttempts: 0,
            lastVerificationAttemptAt: null,
            isSuspended: false,
            suspendedAt: null,
            suspensionReason: null,
            teamId: null,
            role: 'admin',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
            deletedAt: null,
          },
        },
      }),
    }));
    await page.route('**/api/v1/admin/finale/registrations**', async (route) => {
      if (route.request().method() === 'PATCH') {
        admittedAt = '2026-08-28T09:30:00.000Z';
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: attendee() }) });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            registrations: [attendee()],
            stats: { total: 84, admitted: admittedAt ? 33 : 32, awaiting: admittedAt ? 51 : 52 },
            pagination: { page: 1, limit: 25, total: 1, totalPages: 1 },
          },
        }),
      });
    });

    await page.goto('/admin/finale');
    await expect(page.getByRole('heading', { name: 'Attendee registrations' })).toBeVisible();
    await expect(page.getByText('84')).toBeVisible();
    await page.getByPlaceholder('Search name, email, phone, or reg number').fill('Amina');
    await expect(page.getByText('Amina Bello')).toBeVisible();
    await page.getByRole('button', { name: 'Admit' }).click();
    await expect(page.getByText('Admitted', { exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('finale-admin.png'), fullPage: true });
  });
});
