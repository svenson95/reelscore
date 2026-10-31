import { expect, type Locator, type Page } from '@playwright/test';

export class CompetitionPage {
  readonly root: Locator;
  readonly tabNavigation: Locator;
  readonly tabs: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('competition-page');
    this.tabNavigation = this.root.getByRole('group', {
      name: 'Wettbewerbsnavigation',
    });
    this.tabs = this.tabNavigation.getByRole('button');
  }

  async goto(competitionUrl: string): Promise<void> {
    await this.page.goto(`/competition/${competitionUrl}`);
  }

  async selectTab(name: string): Promise<void> {
    await this.tabNavigation.getByRole('button', { name }).click();
  }

  async expectTabCount(count: number): Promise<void> {
    await expect(this.tabs).toHaveCount(count);
  }
}
