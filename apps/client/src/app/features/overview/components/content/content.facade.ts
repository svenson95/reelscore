import { computed, effect, inject, Injectable, untracked } from '@angular/core';

import { formatCalendarWeekKey, type DateString } from '@lib/shared';

import { DateNavigationService, SelectedDateService } from '../../services';
import { WeekFixturesStore, WeekStandingsStore } from '../../stores';

@Injectable()
export class OverviewContentFacade {
  readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  private readonly dateNavigationService = inject(DateNavigationService);
  private readonly selectedDateService = inject(SelectedDateService);
  private readonly selectedDay = this.selectedDateService.selectedDay;
  readonly tabIndex = this.dateNavigationService.selectedTabIndex;

  private readonly weekFixturesStore = inject(WeekFixturesStore);
  readonly weekFixtures = this.weekFixturesStore.weekFixtures;
  readonly fixturesLoading = this.weekFixturesStore.isLoading;
  readonly fixturesError = this.weekFixturesStore.error;

  private readonly weekStandingsStore = inject(WeekStandingsStore);
  readonly weekStandings = this.weekStandingsStore.weekStandings;
  readonly standingsLoading = this.weekStandingsStore.isLoading;
  readonly standingsError = this.weekStandingsStore.error;

  private readonly selectedDateString = computed<DateString>(
    () => this.selectedDay().split('T')[0]
  );

  private readonly weekKey = computed(() => {
    const date: DateString = this.selectedDateString();
    return formatCalendarWeekKey(date);
  });

  private previousWeekKey: string | null = null;

  readonly calendarWeekEffect = effect(() => {
    const weekKey = this.weekKey();

    if (this.previousWeekKey === weekKey) {
      return;
    }

    this.previousWeekKey = weekKey;
    const date = untracked(this.selectedDateString);

    this.weekFixturesStore.loadWeekFixtures(date);
    this.weekStandingsStore.loadWeekStandings(date);
  });
}
