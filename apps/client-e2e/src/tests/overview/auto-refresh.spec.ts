import test, { expect, type Request } from '@playwright/test';

import { OverviewPage } from '../../pages';

const testDate = '2023-11-02';

const AUTO_REFRESH_INTERVAL_MS = 15_000;
const EXPECTED_FIXTURE_REQUESTS = 3;
const AUTO_REFRESH_TIMEOUT_MS = AUTO_REFRESH_INTERVAL_MS * 2 + 10_000;

test('continues auto-refreshing while a fixture is playing', async ({
  page,
}) => {
  test.setTimeout(AUTO_REFRESH_TIMEOUT_MS + 10_000);

  const overviewPage = new OverviewPage(page);

  const fixtureRequests: string[] = [];

  const requestListener = (request: Request): void => {
    fixtureRequests.push(request.url());
  };

  await overviewPage.mockSelectedDayAsPlaying(testDate);

  page.on('request', overviewPage.getFixturesRequestListener(requestListener));

  await overviewPage.goto(testDate);
  await overviewPage.expectLoaded();

  expect(fixtureRequests).toHaveLength(1);

  await overviewPage.expectRefreshTimerRunning();

  await expect
    .poll(() => fixtureRequests.length, {
      timeout: AUTO_REFRESH_TIMEOUT_MS,
    })
    .toBeGreaterThanOrEqual(EXPECTED_FIXTURE_REQUESTS);

  await overviewPage.expectRefreshTimerRunning();
});
