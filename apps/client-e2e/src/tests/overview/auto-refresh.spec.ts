import test, { expect, type Request } from '@playwright/test';

import { OverviewPage } from '../../pages';

const testDate = '2023-11-02';

const AUTO_REFRESH_INTERVAL_MS = 15_000;
const AUTO_REFRESH_INTERVAL_SECONDS = AUTO_REFRESH_INTERVAL_MS / 1000;

const EXPECTED_FIXTURE_REQUESTS = 3;
const AUTO_REFRESH_TIMEOUT_MS = AUTO_REFRESH_INTERVAL_MS * 2 + 10_000;

test.describe('Overview Page', () => {
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

    page.on(
      'request',
      overviewPage.getFixturesRequestListener(requestListener)
    );

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

  test('resumes auto-refresh timer after returning to the overview', async ({
    page,
  }) => {
    const overviewPage = new OverviewPage(page);

    const targetTimerValue = AUTO_REFRESH_INTERVAL_SECONDS - 5;

    await overviewPage.mockSelectedDayAsPlaying(testDate);

    await overviewPage.goto(testDate);
    await overviewPage.expectLoaded();
    await overviewPage.expectRefreshTimerRunning();

    await expect
      .poll(() => overviewPage.getRefreshTimerValue(), {
        timeout: 10_000,
      })
      .toBeLessThanOrEqual(targetTimerValue);

    const timerBeforeNavigation = await overviewPage.getRefreshTimerValue();

    await overviewPage.getFirstFixture().click();

    await expect(overviewPage.root).toBeHidden();

    await page.goBack();

    await overviewPage.expectLoaded();
    await overviewPage.expectRefreshTimerRunning();

    const restoredTimer = await overviewPage.getRefreshTimerValue();

    expect(restoredTimer).toBeLessThanOrEqual(timerBeforeNavigation);
    expect(restoredTimer).toBeGreaterThanOrEqual(timerBeforeNavigation - 1);

    await expect
      .poll(() => overviewPage.getRefreshTimerValue())
      .toBeLessThan(restoredTimer);
  });
});
