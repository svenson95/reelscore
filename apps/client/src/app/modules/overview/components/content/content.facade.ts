import { effect, inject, Injectable, untracked } from '@angular/core';

import { DateService } from '../../services';
import { WeekdayFixturesStore, WeekdayStandingsStore } from '../../store';

@Injectable()
export class OverviewContentFacade {
  readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  private dateService = inject(DateService);
  private selectedDay = this.dateService.selectedDay;
  tabIndex = this.dateService.selectedTabIndex;

  private weekFixturesStore = inject(WeekdayFixturesStore);
  weekFixtures = this.weekFixturesStore.weekFixtures;
  fixturesLoading = this.weekFixturesStore.isLoading;
  fixturesError = this.weekFixturesStore.error;

  private weekStandingsStore = inject(WeekdayStandingsStore);
  weekStandings = this.weekStandingsStore.weekStandings;
  standingsLoading = this.weekStandingsStore.isLoading;
  standingsError = this.weekStandingsStore.error;

  calendarWeekEffect = effect(() => {
    void this.dateService.calendarWeek(); // trigger recompute
    const date = untracked(this.selectedDay).split('T')[0];
    this.weekFixturesStore.loadWeekdayFixtures(date);
    this.weekStandingsStore.loadWeekdayStandings(date);
  });
}
