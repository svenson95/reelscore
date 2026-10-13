import { expect, type Locator, test } from '@playwright/test';

import { EXAMPLE_FIXTURE } from '@testing/client';

const teamNameCases = [
  {
    description: 'long team names',
    home: 'Northshore Athletic Football Club',
    away: 'Riverside Borough United',
  },
  {
    description: 'short team names',
    home: 'Alpha FC',
    away: 'Beta FC',
  },
];

for (const teamNamesForCase of teamNameCases) {
  test(
    'keeps the match header layout stable for ' +
      teamNamesForCase.description +
      ' when fixture data replaces skeletons',
    async ({ page }) => {
      const { home: homeTeamName, away: awayTeamName } = teamNamesForCase;
      await page.setViewportSize({ width: 390, height: 844 });

      let releaseFixtureResponse!: () => void;
      const fixtureResponseReleased = new Promise<void>((resolve) => {
        releaseFixtureResponse = resolve;
      });

      await page.route('**/fixtures/by-id**', async (route) => {
        await fixtureResponseReleased;
        await route.fulfill({
          json: {
            data: {
              ...EXAMPLE_FIXTURE,
              teams: {
                ...EXAMPLE_FIXTURE.teams,
                home: { ...EXAMPLE_FIXTURE.teams.home, name: homeTeamName },
                away: { ...EXAMPLE_FIXTURE.teams.away, name: awayTeamName },
              },
            },
            highlights: [],
          },
        });
      });

      await page.goto('/2026-05-30/champions-league/1544371', {
        waitUntil: 'domcontentloaded',
      });

      const matchHeader = page.locator('section[rs-match-header]');
      const teamNames = matchHeader.locator('rs-match-info-team .team-name');
      const teamNameSkeletons = matchHeader.locator(
        'rs-match-info-team .team-name-placeholder'
      );

      await expect(matchHeader).toHaveClass(/animate-fade-in/);
      await expect(
        matchHeader.locator('.competition-label-placeholder')
      ).toBeVisible();
      await expect(teamNameSkeletons).toHaveCount(2);
      await expect(
        matchHeader.locator('.team-name-placeholder-line')
      ).toHaveCount(4);

      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await matchHeader.evaluate(async (element) => {
        await Promise.all(
          element.getAnimations().map((animation) => animation.finished)
        );
      });

      const layoutBeforeData = await getMatchHeaderLayout(matchHeader);

      releaseFixtureResponse();

      await expect(teamNames.nth(0)).toHaveText(homeTeamName);
      await expect(teamNames.nth(1)).toHaveText(awayTeamName);
      await page.evaluate(async () => {
        await document.fonts.ready;
      });

      const layoutAfterData = await getMatchHeaderLayout(matchHeader);

      expect(layoutAfterData).toEqual(layoutBeforeData);
    }
  );
}

async function getMatchHeaderLayout(matchHeader: Locator): Promise<number[][]> {
  return matchHeader.evaluate((header) => {
    const selectors = [
      '.wrapper',
      '.competition-label',
      'rs-match-info',
      'rs-match-info-team',
      '.result-column',
    ];

    return selectors.map((selector) => {
      const element = header.querySelector(selector);

      if (!element) {
        throw new Error(
          'Match header element "' + selector + '" was not found'
        );
      }

      const { x, y, width, height } = element.getBoundingClientRect();
      return [x, y, width, height].map((value) => Number(value.toFixed(2)));
    });
  });
}
