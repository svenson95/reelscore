import { computed, effect, inject, Injectable } from '@angular/core';

import moment from 'moment';

import { DateString } from '@app/shared';

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

  readonly weekKey = computed(() => {
    const date = this.selectedDay().split('T')[0] as DateString;
    const momentDate = moment.tz(date, 'YYYY-MM-DD', 'Europe/Berlin');

    return `${momentDate.isoWeekYear()}-W${momentDate.isoWeek()}`;
  });

  private previousWeekKey: string | null = null;

  readonly calendarWeekEffect = effect(() => {
    const date = this.selectedDay().split('T')[0] as DateString;
    const weekKey = this.getCalendarWeekKey(date);

    if (this.previousWeekKey === weekKey) {
      return;
    }

    this.previousWeekKey = weekKey;

    this.weekFixturesStore.loadWeekdayFixtures(date);
    this.weekStandingsStore.loadWeekdayStandings(date);
  });

  private getCalendarWeekKey(day: DateString): string {
    const date = moment.tz(day, 'YYYY-MM-DD', 'Europe/Berlin');

    return `${date.isoWeekYear()}-W${date.isoWeek()}`;
  }
}
