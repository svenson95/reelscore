import test, { expect } from '@playwright/test';

test('should preserve selected day after navigating back from a match', async ({
  page,
}) => {
  await page.goto('/2026-08-11');

  const selectedDate = page.getByTestId('selected-date');
  const fixtureItems = page.getByTestId('fixture-list-item');

  await expect(selectedDate).toContainText('11.08.26');

  await expect(fixtureItems.first()).toBeVisible({
    timeout: 15_000,
  });

  await fixtureItems.first().click();

  await expect(page).toHaveURL(/\/2026-08-11\/[^/]+\/\d+$/);

  await page.goBack();

  await expect(page).toHaveURL(/\/2026-08-11$/);
  await expect(selectedDate).toContainText('11.08.26');
});
