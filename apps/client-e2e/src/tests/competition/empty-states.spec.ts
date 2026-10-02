import test, { expect } from '@playwright/test';

import { CompetitionPage } from '../../pages';

test.describe('Competition Page', () => {
  test('loads competition data and shows the empty states across its tabs', async ({
    page,
  }) => {
    await page.route('**/fixtures/competition-fixtures**', (route) =>
      route.fulfill({ json: [] })
    );
    await page.route('**/standings/standings-by-id**', (route) =>
      route.fulfill({
        json: {
          _id: 'empty-standings',
          league: {
            id: 78,
            name: 'Bundesliga',
            country: 'Germany',
            logo: '',
            flag: null,
            season: 2026,
            standings: [],
          },
          createdAt: '2026-10-02T00:00:00.000Z',
          updatedAt: '2026-10-02T00:00:00.000Z',
        },
      })
    );
    await page.route('**/top-scorers/**', (route) =>
      route.fulfill({
        json: {
          _id: 'empty-scorers',
          parameters: { league: '78', season: '2026' },
          response: [],
          createdAt: '2026-10-02T00:00:00.000Z',
          updatedAt: '2026-10-02T00:00:00.000Z',
        },
      })
    );

    const competitionPage = new CompetitionPage(page);

    await competitionPage.goto('bundesliga');

    await expect(competitionPage.root).toBeVisible();
    await competitionPage.expectTabCount(4);
    await expect(page.getByText('Keine vergangenen Spiele')).toBeVisible();

    await competitionPage.selectTab('Spielplan');
    await expect(page.getByText('Keine anstehenden Spiele')).toBeVisible();

    await competitionPage.selectTab('Tabellen');
    await expect(page.getByText('Keine Tabelle vorhanden')).toBeVisible();

    await competitionPage.selectTab('Spieler-Statistiken');
    await expect(page.getByText('Keine Torschützen vorhanden')).toBeVisible();
    await expect(page.getByText('Keine Vorlagengeber vorhanden')).toBeVisible();
  });
});
