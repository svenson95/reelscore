import type { Locator, Page } from '@playwright/test';

export class OverviewPage {
  readonly selectedDate: Locator;
  readonly fixtureItems: Locator;

  constructor(private readonly page: Page) {
    this.selectedDate = page.getByTestId('selected-date');
    this.fixtureItems = page.getByTestId('fixture-list-item');
  }

  async goto(date: string): Promise<void> {
    await this.page.goto(`/${date}`);
  }

  getFirstFixture(): Locator {
    return this.fixtureItems.first();
  }
}
