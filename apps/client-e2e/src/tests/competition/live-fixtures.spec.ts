import test, { expect } from '@playwright/test';

import { CompetitionPage } from '../../pages';

test.describe('Competition Page', () => {
  test('shows a live match in results and keeps it out of the fixture schedule', async ({
    page,
  }) => {
    await page.route('**/fixtures/competition-fixtures**', async (route) => {
      const requestType = new URL(route.request().url()).searchParams.get(
        'type'
      );

      await route.fulfill({
        json: requestType === 'last' ? [[createLiveFixture()]] : [],
      });
    });
    await page.route('**/standings/standings-by-id**', (route) =>
      route.fulfill({ json: null })
    );
    await page.route('**/top-scorers/**', (route) =>
      route.fulfill({ json: null })
    );

    const competitionPage = new CompetitionPage(page);

    await competitionPage.goto('bundesliga');

    const liveMatch = page.getByTestId('fixture-list-item');

    await expect(liveMatch).toBeVisible();
    await expect(liveMatch).toContainText("32'");
    await expect(liveMatch).toContainText('Test Home');
    await expect(liveMatch).toContainText('Test Away');

    await competitionPage.selectTab('Spielplan');

    await expect(page.getByText('Keine anstehenden Spiele')).toBeVisible();
    await expect(liveMatch).toHaveCount(0);
  });
});

function createLiveFixture() {
  return {
    _id: 'live-fixture',
    fixture: {
      id: 123456,
      referee: '',
      timezone: 'Europe/Berlin',
      date: '2026-10-02T18:30:00+02:00',
      timestamp: 1790958600,
      periods: { first: 1790958600, second: null },
      venue: { id: null, name: '', city: '' },
      status: { long: 'First Half', short: '1H', elapsed: 32, extra: null },
    },
    league: {
      id: 78,
      name: 'Bundesliga',
      country: 'Germany',
      logo: '',
      flag: null,
      season: 2026,
      round: 'Regular Season - 1',
    },
    teams: {
      home: { id: 1, name: 'Test Home', logo: '', winner: null },
      away: { id: 2, name: 'Test Away', logo: '', winner: null },
    },
    goals: { home: 1, away: 0 },
    score: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: null, away: null },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null },
    },
    final: { firstLegResult: null, winnerOfFinal: null },
  };
}
