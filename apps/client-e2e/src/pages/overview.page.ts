import {
  expect,
  type Locator,
  type Page,
  type Request,
} from '@playwright/test';

import type { FixturesWeekData } from '@lib/models';
import { formatDateToYearMonthDay } from '@lib/shared';

export class OverviewPage {
  readonly root: Locator;
  readonly selectedDate: Locator;
  readonly fixtureItems: Locator;
  readonly refreshTimer: Locator;

  readonly fixturesTitle: Locator;
  readonly fixturesLoading: Locator;
  readonly standingsLoading: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('overview-page');
    this.selectedDate = page.getByTestId('selected-date');
    this.fixtureItems = page.getByTestId('fixture-list-item');
    this.refreshTimer = page.getByTestId('refresh-timer');

    this.fixturesTitle = page.getByTestId('fixtures-title');
    this.fixturesLoading = page.getByTestId('fixtures-loading');
    this.standingsLoading = page.getByTestId('standings-loading');
  }

  async goto(date: string): Promise<void> {
    await this.page.goto(`/${date}`);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.fixtureItems.first()).toBeVisible();
  }

  async selectDate(day: number): Promise<void> {
    await this.selectedDate.click();

    const calendar = this.page.locator('mat-datepicker-content');

    await expect(calendar).toBeVisible();

    await calendar
      .locator('.mat-calendar-body-cell')
      .filter({ hasText: new RegExp(`^\\s*${day}\\s*$`) })
      .click();
  }

  async expectWeekLoading(): Promise<void> {
    await expect(this.fixturesLoading).toBeVisible();
    await expect(this.standingsLoading).toBeVisible();
  }

  async expectRefreshTimerRunning(): Promise<void> {
    await expect(this.refreshTimer).toHaveClass(/\bis-active\b/);
  }

  async getRefreshTimerValue(): Promise<number> {
    const value = await this.refreshTimer.getAttribute('data-timer');

    if (value === null) {
      throw new Error('Refresh timer value is missing');
    }

    const timer = Number(value);

    if (Number.isNaN(timer)) {
      throw new Error(`Invalid refresh timer value: "${value}"`);
    }

    return timer;
  }

  async mockSelectedDayAsPlaying(date: string): Promise<void> {
    await this.page.route('**/fixtures/by-date**', async (route) => {
      const response = await route.fetch();
      const weekFixtures = (await response.json()) as FixturesWeekData;

      const fixture = weekFixtures
        .flat()
        .find((f) => formatDateToYearMonthDay(f.fixture.date) === date);

      if (!fixture) {
        await route.fulfill({ response });
        return;
      }

      fixture.fixture.status = {
        ...fixture.fixture.status,
        short: '2H',
      };

      await route.fulfill({
        response,
        json: weekFixtures,
      });
    });
  }

  getFirstFixture(): Locator {
    return this.fixtureItems.first();
  }

  getFixturesRequestListener(
    listener: (request: Request) => void
  ): (request: Request) => void {
    return (request) => {
      if (request.url().includes('/fixtures/by-date')) {
        listener(request);
      }
    };
  }
}
