import type { Locator, Page } from '@playwright/test';

export class MatchPage {
  readonly latestFixtures: Locator;

  constructor(page: Page) {
    this.latestFixtures = page.getByTestId('match-latest-fixtures');
  }
}
