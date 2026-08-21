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

type VisibleWeekMode =
  | 'current'
  | 'previous-edge'
  | 'next-edge'
  | 'unavailable';

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
    () => this.selectedDay().split('T')[0] as DateString
  );

  private readonly weekKey = computed(() =>
    formatCalendarWeekKey(this.selectedDateString())
  );

  private readonly fixturesVisibleWeekMode = computed(() =>
    getVisibleWeekMode(
      this.weekFixturesStore.weekKey(),
      this.selectedDateString()
    )
  );

  private readonly standingsVisibleWeekMode = computed(() =>
    getVisibleWeekMode(
      this.weekStandingsStore.weekKey(),
      this.selectedDateString()
    )
  );

  readonly weekFixtures = computed(() =>
    getVisibleWeekData(
      this.weekFixturesStore.weekFixtures(),
      this.fixturesVisibleWeekMode()
    )
  );

  readonly weekStandings = computed(() =>
    getVisibleWeekData(
      this.weekStandingsStore.weekStandings(),
      this.standingsVisibleWeekMode()
    )
  );

  readonly hasFixturesDataForSelectedDay = computed(
    () =>
      this.weekFixturesStore.weekKey() !== null &&
      this.fixturesVisibleWeekMode() !== 'unavailable'
  );

  readonly hasStandingsDataForSelectedDay = computed(
    () =>
      this.weekStandingsStore.weekKey() !== null &&
      this.standingsVisibleWeekMode() !== 'unavailable'
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

function getVisibleWeekMode(
  cachedWeekKey: string | null,
  selectedDay: DateString
): VisibleWeekMode {
  if (
    cachedWeekKey === null ||
    cachedWeekKey === formatCalendarWeekKey(selectedDay)
  ) {
    return 'current';
  }

  const cachedWeekStart = getWeekStartFromKey(cachedWeekKey);

  if (selectedDay === addDays(cachedWeekStart, 7)) {
    return 'next-edge';
  }

  if (selectedDay === addDays(cachedWeekStart, -1)) {
    return 'previous-edge';
  }

  return 'unavailable';
}

function getVisibleWeekData<T>(
  data: T[],
  mode: VisibleWeekMode
): Array<T | undefined> {
  switch (mode) {
    case 'current':
      return data.slice(CURRENT_WEEK_START_INDEX, CURRENT_WEEK_END_INDEX + 1);

    case 'next-edge':
      return createEdgeWeekData(UI_WEEK_FIRST_INDEX, data[EDGE_NEXT_DAY_INDEX]);

    case 'previous-edge':
      return createEdgeWeekData(
        UI_WEEK_LAST_INDEX,
        data[EDGE_PREVIOUS_DAY_INDEX]
      );

    case 'unavailable':
      return Array(UI_DAYS_PER_WEEK).fill(undefined);
  }
}

function createEdgeWeekData<T>(
  index: number,
  edgeDayData: T | undefined
): Array<T | undefined> {
  const weekData = Array<T | undefined>(UI_DAYS_PER_WEEK).fill(undefined);
  weekData[index] = edgeDayData;

  return weekData;
}
