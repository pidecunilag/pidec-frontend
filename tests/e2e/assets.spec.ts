import { expect, test } from '@playwright/test';

test('serves the Stage 1 proposal template as a DOCX asset', async ({ page }) => {
  const response = await page.request.get('/templates/stage-1-proposal-template.docx');

  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  );

  const body = await response.body();
  expect(body.byteLength).toBeGreaterThan(50_000);
});

test('serves the Stage 1 judging guide as a readable PDF asset', async ({ page }) => {
  const response = await page.request.get('/stage-1-judging-guide.pdf');

  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');

  const body = await response.body();
  expect(body.byteLength).toBeGreaterThan(50_000);
});
