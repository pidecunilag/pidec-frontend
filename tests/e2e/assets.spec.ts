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
