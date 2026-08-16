import test, { expect } from '@playwright/test';

import { OverviewPage } from '../../pages';
test('should preserve selected day after navigating back from a match', async ({
  page,
}) => {
  const overviewPage = new OverviewPage(page);
  const testDate = '2026-08-11';
  const expectedLabel = '11.08.26';

  await overviewPage.goto(testDate);

  await expect(overviewPage.selectedDate).toContainText(expectedLabel);

  const firstFixture = overviewPage.getFirstFixture();

  await expect(firstFixture).toBeVisible({
    timeout: 15_000,
  });

  await firstFixture.click();

  await expect(page).toHaveURL(new RegExp(`/${testDate}/[^/]+/\\d+$`));

  await page.goBack();

  await expect(page).toHaveURL(new RegExp(`/${testDate}$`));
  await expect(overviewPage.selectedDate).toContainText(expectedLabel);
});
