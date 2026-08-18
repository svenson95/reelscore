import test, { expect } from '@playwright/test';

import { OverviewPage } from '../../pages';

const testDate = '2026-08-11';
const expectedLabel = '11.08.26';

test('should preserve selected day after navigating back from a match', async ({
  page,
}) => {
  const overviewPage = new OverviewPage(page);

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

test('reuses loaded overview data when navigating back from a match', async ({
  page,
}) => {
  let fixturesRequests = 0;
  let standingsRequests = 0;

  page.on('request', (request) => {
    if (request.url().includes('/fixtures/by-date')) {
      fixturesRequests++;
    }

    if (request.url().includes('/standings/start-top-five')) {
      standingsRequests++;
    }
  });

  const overviewPage = new OverviewPage(page);

  await overviewPage.goto(testDate);

  const firstFixture = overviewPage.getFirstFixture();

  await expect(firstFixture).toBeVisible({
    timeout: 15_000,
  });

  const fixturesRequestsBeforeNavigation = fixturesRequests;
  const standingsRequestsBeforeNavigation = standingsRequests;

  await firstFixture.click();

  await page.goBack();

  await expect(page).toHaveURL(new RegExp(`/${testDate}$`));
  await expect(overviewPage.selectedDate).toContainText(expectedLabel);

  expect(fixturesRequests).toBe(fixturesRequestsBeforeNavigation);
  expect(standingsRequests).toBe(standingsRequestsBeforeNavigation);
});
