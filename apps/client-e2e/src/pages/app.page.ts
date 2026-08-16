import type { Locator, Page } from '@playwright/test';

type GoToOptions = Parameters<Page['goto']>[1];

export class AppPage {
  readonly startupOverlay: Locator;
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.startupOverlay = page.getByTestId('startup-overlay');
    this.root = page.locator('rs-root');
  }

  async goto(options?: GoToOptions): Promise<void> {
    await this.page.goto('/', options);
  }
}
