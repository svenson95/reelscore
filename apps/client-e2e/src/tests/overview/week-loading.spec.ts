import { expect, test } from '@playwright/test';

import type { FixturesWeekData } from '@reelscore-sdk/models';

import { OverviewPage } from '../../pages';

test.describe('Overview Page', () => {
  test('does not leave extra space below an empty day on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const overviewPage = new OverviewPage(page);

    await overviewPage.goto('2026-08-18');
    await overviewPage.expectLoaded();

    let resolveNextWeekFixtures!: () => void;
    const nextWeekFixturesLoaded = new Promise<void>((resolve) => {
      resolveNextWeekFixtures = resolve;
    });

    await page.route('**/fixtures/by-date**', async (route) => {
      const requestDate = new URL(route.request().url()).searchParams.get(
        'date'
      );

      if (requestDate !== '2026-08-24') {
        await route.continue();
        return;
      }

      const response = await route.fetch();
      const weekFixtures = (await response.json()) as FixturesWeekData;

      weekFixtures[1] = [];

      await route.fulfill({ response, json: weekFixtures });
      resolveNextWeekFixtures();
    });

    for (let day = 0; day < 5; day += 1) {
      await overviewPage.nextDayButton.click();
    }

    await expect(page).toHaveURL(/\/2026-08-23$/);
    await expect(overviewPage.fixtureItems.first()).toBeVisible();

    await overviewPage.nextDayButton.click();

    await expect(page).toHaveURL(/\/2026-08-24$/);
    await nextWeekFixturesLoaded;

    const activeDayPanel = overviewPage.root.locator(
      '.tab-content:visible:not(.slide-out)'
    );
    const emptyFixturesSection = activeDayPanel.locator('.fixtures-container');
    const emptyState = emptyFixturesSection.locator('p.no-data');

    await expect(emptyState).toHaveText('Es finden keine Spiele statt.');

    const extraSpaceBelowEmptyState = await emptyFixturesSection.evaluate(
      (section) => {
        const noDataMessage = section.querySelector('p.no-data');

        if (!noDataMessage) {
          throw new Error('Expected the empty state in the fixtures section.');
        }

        const sectionBottom = section.getBoundingClientRect().bottom;
        const noDataMessageBottom =
          noDataMessage.getBoundingClientRect().bottom;

        return sectionBottom - noDataMessageBottom;
      }
    );

    expect(extraSpaceBelowEmptyState).toBeLessThanOrEqual(1);
  });

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
