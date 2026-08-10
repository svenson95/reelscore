import { computed, effect, inject, Injectable, untracked } from '@angular/core';

import type { DateString } from '@lib/shared';
import { formatCalendarWeekKey } from '@lib/shared';

import { DateService, SelectedDateService } from '../../services';
import { WeekdayFixturesStore, WeekdayStandingsStore } from '../../store';

@Injectable()
export class OverviewContentFacade {
  readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  private readonly dateService = inject(DateService);
  private readonly selectedDateService = inject(SelectedDateService);
  private readonly selectedDay = this.selectedDateService.selectedDay;
  readonly tabIndex = this.dateService.selectedTabIndex;

  private readonly weekFixturesStore = inject(WeekdayFixturesStore);
  readonly weekFixtures = this.weekFixturesStore.weekFixtures;
  readonly fixturesLoading = this.weekFixturesStore.isLoading;
  readonly fixturesError = this.weekFixturesStore.error;

  private readonly weekStandingsStore = inject(WeekdayStandingsStore);
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

    this.weekFixturesStore.loadWeekdayFixtures(date);
    this.weekStandingsStore.loadWeekdayStandings(date);
  });
}
