import { expect, test } from '@playwright/test';

import { OverviewPage } from '../../pages';

test.describe('Overview Page', () => {
  test('shows loading states while switching to an uncached week', async ({
    page,
  }) => {
    const overviewPage = new OverviewPage(page);

    await overviewPage.goto('2026-08-18');
    await overviewPage.expectLoaded();

    let releaseFixturesRequest!: () => void;
    let releaseStandingsRequest!: () => void;

    const fixturesRequestReleased = new Promise<void>((resolve) => {
      releaseFixturesRequest = resolve;
    });

    const standingsRequestReleased = new Promise<void>((resolve) => {
      releaseStandingsRequest = resolve;
    });

    await page.route('**/fixtures/by-date**', async (route) => {
      await fixturesRequestReleased;
      await route.continue();
    });

    await page.route('**/standings/start-top-five**', async (route) => {
      await standingsRequestReleased;
      await route.continue();
    });

    await overviewPage.selectDate(11);

    await expect(page).toHaveURL(/\/2026-08-11$/);

    await expect(overviewPage.fixturesTitle).toBeVisible();

    await overviewPage.expectWeekLoading();

    releaseFixturesRequest();
    releaseStandingsRequest();

    await expect(overviewPage.fixturesLoading).toBeHidden();
    await expect(overviewPage.standingsLoading).toBeHidden();

    await expect(overviewPage.fixtureItems.first()).toBeVisible();
  });

  test('keeps the edge monday visible while the following week is loading', async ({
    page,
  }) => {
    const overviewPage = new OverviewPage(page);

    await overviewPage.goto('2026-08-18');
    await overviewPage.expectLoaded();

    let releaseFixturesRequest!: () => void;
    let notifyFixturesRequestStarted!: () => void;

    const fixturesRequestReleased = new Promise<void>((resolve) => {
      releaseFixturesRequest = resolve;
    });

    const fixturesRequestStarted = new Promise<void>((resolve) => {
      notifyFixturesRequestStarted = resolve;
    });

    await page.route('**/fixtures/by-date**', async (route) => {
      const requestDate = new URL(route.request().url()).searchParams.get(
        'date'
      );

      if (requestDate === '2026-08-24') {
        notifyFixturesRequestStarted();
        await fixturesRequestReleased;
      }

      await route.continue();
    });

    for (let day = 0; day < 6; day += 1) {
      await overviewPage.nextDayButton.click();
    }

    await expect(page).toHaveURL(/\/2026-08-24$/);
    await fixturesRequestStarted;

    await expect(overviewPage.fixtureItems.first()).toBeVisible();
    await expect(overviewPage.fixturesLoading).toBeHidden();

    releaseFixturesRequest();

    await expect(overviewPage.fixtureItems.first()).toBeVisible();
  });
});
