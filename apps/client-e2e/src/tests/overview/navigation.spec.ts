import test, { expect, type Request } from '@playwright/test';

import { mockRealtimeConnected } from '../../helpers';
import { MatchPage, OverviewPage } from '../../pages';

const testDate = '2026-08-11';
const expectedLabel = '11.08.26';

const OVERVIEW_DATA_ENDPOINTS = [
  '/fixtures/by-date',
  '/standings/start-top-five',
];

test.describe('Overview Page', () => {
  test('restores data without reloading after navigating back from a match', async ({
    page,
  }) => {
    const overviewPage = new OverviewPage(page);
    const matchPage = new MatchPage(page);

    await mockRealtimeConnected(page);

    await overviewPage.goto(testDate);

    await expect(overviewPage.selectedDate).toContainText(expectedLabel);

    const firstFixture = overviewPage.getFirstFixture();

    await expect(firstFixture).toBeVisible({
      timeout: 15_000,
    });

    await firstFixture.click();

    await expect(page).toHaveURL(new RegExp(`/${testDate}/[^/]+/\\d+$`));

    await expect(matchPage.latestFixtures).toBeVisible({
      timeout: 15_000,
    });

    const overviewRequests: string[] = [];

    const requestListener = (request: Request): void => {
      const matchingRequests = OVERVIEW_DATA_ENDPOINTS.filter((endpoint) =>
        request.url().includes(endpoint)
      ).map(() => request.url());

      overviewRequests.push(...matchingRequests);
    };

    page.on('request', requestListener);

    await page.goBack();

    await expect(page).toHaveURL(new RegExp(`/${testDate}$`));
    await expect(overviewPage.selectedDate).toContainText(expectedLabel);

    page.off('request', requestListener);

    expect(overviewRequests).toEqual([]);
  });
});
