import { computed, effect, inject, Injectable, untracked } from '@angular/core';

import {
  addDays,
  formatCalendarWeekKey,
  getWeekStartFromKey,
  type DateString,
} from '@lib/shared';

import { DateNavigationService, SelectedDateService } from '../../services';
import { WeekFixturesStore, WeekStandingsStore } from '../../stores';

const EDGE_PREVIOUS_DAY_INDEX = 0;
const CURRENT_WEEK_START_INDEX = 1;
const CURRENT_WEEK_END_INDEX = 7;
const EDGE_NEXT_DAY_INDEX = 8;

const UI_WEEK_FIRST_INDEX = 0;
const UI_WEEK_LAST_INDEX = 6;
const UI_DAYS_PER_WEEK = 7;

@Injectable()
export class OverviewContentFacade {
  readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  private readonly dateNavigationService = inject(DateNavigationService);
  private readonly selectedDateService = inject(SelectedDateService);

  private readonly selectedDay = this.selectedDateService.selectedDay;
  readonly tabIndex = this.dateNavigationService.selectedTabIndex;

  private readonly weekFixturesStore = inject(WeekFixturesStore);
  readonly fixturesLoading = this.weekFixturesStore.isLoading;
  readonly fixturesError = this.weekFixturesStore.error;

  private readonly weekStandingsStore = inject(WeekStandingsStore);
  readonly standingsLoading = this.weekStandingsStore.isLoading;
  readonly standingsError = this.weekStandingsStore.error;

  private readonly selectedDateString = computed<DateString>(
    () => this.selectedDay().split('T')[0]
  );

  private readonly weekKey = computed(() =>
    formatCalendarWeekKey(this.selectedDateString())
  );

  readonly weekFixtures = computed(() =>
    getVisibleWeekData(
      this.weekFixturesStore.weekFixtures(),
      this.weekFixturesStore.weekKey(),
      this.selectedDateString()
    )
  );

  readonly weekStandings = computed(() =>
    getVisibleWeekData(
      this.weekStandingsStore.weekStandings(),
      this.weekStandingsStore.weekKey(),
      this.selectedDateString()
    )
  );

  readonly hasFixturesDataForSelectedDay = computed(() =>
    hasDataForSelectedDay(
      this.weekFixturesStore.weekKey(),
      this.selectedDateString()
    )
  );

  readonly hasStandingsDataForSelectedDay = computed(() =>
    hasDataForSelectedDay(
      this.weekStandingsStore.weekKey(),
      this.selectedDateString()
    )
  );

  private readonly calendarWeekEffect = effect(() => {
    const weekKey = this.weekKey();

    const isCached = untracked(
      () =>
        this.weekFixturesStore.weekKey() === weekKey &&
        this.weekStandingsStore.weekKey() === weekKey
    );

    if (isCached) {
      return;
    }

    const date = untracked(this.selectedDateString);

    this.weekFixturesStore.loadWeekFixtures(date);
    this.weekStandingsStore.loadWeekStandings(date);
  });
}

function getVisibleWeekData<T>(
  data: T[],
  cachedWeekKey: string | null,
  selectedDay: DateString
): Array<T | undefined> {
  if (cachedWeekKey === null) {
    return data;
  }

  if (cachedWeekKey === formatCalendarWeekKey(selectedDay)) {
    return data.slice(CURRENT_WEEK_START_INDEX, CURRENT_WEEK_END_INDEX + 1);
  }

  const weekStart = getWeekStartFromKey(cachedWeekKey);

  if (selectedDay === addDays(weekStart, 7)) {
    return createEdgeWeekData(UI_WEEK_FIRST_INDEX, data[EDGE_NEXT_DAY_INDEX]);
  }

  if (selectedDay === addDays(weekStart, -1)) {
    return createEdgeWeekData(
      UI_WEEK_LAST_INDEX,
      data[EDGE_PREVIOUS_DAY_INDEX]
    );
  }

  return Array(UI_DAYS_PER_WEEK).fill(undefined);
}

function createEdgeWeekData<T>(
  index: number,
  edgeDayData: T | undefined
): Array<T | undefined> {
  const weekData = Array<T | undefined>(UI_DAYS_PER_WEEK).fill(undefined);
  weekData[index] = edgeDayData;

  return weekData;
}

function hasDataForSelectedDay(
  cachedWeekKey: string | null,
  selectedDay: DateString
): boolean {
  if (cachedWeekKey === null) {
    return false;
  }

  const weekStart = getWeekStartFromKey(cachedWeekKey);
  const previousSunday = addDays(weekStart, -1);
  const nextMonday = addDays(weekStart, 7);

  return selectedDay >= previousSunday && selectedDay <= nextMonday;
}
