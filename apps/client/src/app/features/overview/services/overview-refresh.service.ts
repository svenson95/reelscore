import { computed, inject, Injectable } from '@angular/core';

import { getFixtureStatusState, RefreshRegistryService } from '@app/shared';
import { getTodayDateString } from '@lib/shared';

import { getSelectedDayData } from '../helpers';
import { WeekFixturesStore, WeekStandingsStore } from '../stores';

import { DateNavigationService } from './date-navigation.service';
import { SelectedDateService } from './selected-date.service';

@Injectable()
export class OverviewRefreshService {
  private readonly refreshRegistry = inject(RefreshRegistryService);

  private readonly weekFixturesStore = inject(WeekFixturesStore);
  private readonly weekStandingsStore = inject(WeekStandingsStore);

  private readonly selectedDateService = inject(SelectedDateService);
  private readonly dateNavigationService = inject(DateNavigationService);

  private unregister?: () => void;

  private readonly isLive = computed(() => {
    const fixtures =
      getSelectedDayData(
        this.weekFixturesStore.weekFixtures(),
        this.weekFixturesStore.weekKey(),
        this.selectedDateService.selectedDay()
      ) ?? [];

    return fixtures.some(
      (fixture) => getFixtureStatusState(fixture.fixture.status.short).isLive
    );
  });

  private readonly canRefresh = computed(
    () =>
      !this.weekFixturesStore.isPending() &&
      !this.weekStandingsStore.isPending()
  );

  init(): void {
    if (this.unregister) {
      return;
    }

    this.unregister = this.refreshRegistry.register({
      id: 'overview',
      isLive: this.isLive,
      canRefresh: this.canRefresh,
      refresh: () => this.refresh(),
    });
  }

  destroy(): void {
    this.unregister?.();
    this.unregister = undefined;
  }

  private refresh(): void {
    const date = this.selectedDateService.selectedDay();

    this.weekFixturesStore.loadWeekFixtures(date, true);
    this.weekStandingsStore.loadWeekStandings(date, true);

    this.updateTodayIfNeeded();
  }

  private updateTodayIfNeeded(): void {
    const today = getTodayDateString();

    if (this.dateNavigationService.today() !== today) {
      this.dateNavigationService.resetToday();
    }
  }
}
