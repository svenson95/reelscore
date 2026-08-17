import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { HttpWeekFixturesService } from '@app/shared';
import type { FixturesWeekData } from '@lib/models';

import { WeekFixturesStore } from './week-fixtures.store';

const testDate = '2026-08-17';
const nextWeekDate = '2026-08-24';
const daysPerWeek = 7;

describe('WeekFixturesStore', () => {
  let store: InstanceType<typeof WeekFixturesStore>;

  let httpMock: {
    getWeekFixtures: jest.Mock;
  };

  beforeEach(() => {
    httpMock = {
      getWeekFixtures: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        WeekFixturesStore,
        {
          provide: HttpWeekFixturesService,
          useValue: httpMock,
        },
      ],
    });

    store = TestBed.inject(WeekFixturesStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with an empty week', () => {
    expect(store.weekFixtures()).toEqual(createWeekFixtures());
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load fixtures for the selected week', () => {
    const weekFixtures = createWeekFixtures();

    httpMock.getWeekFixtures.mockReturnValue(of(weekFixtures));

    store.loadWeekFixtures(testDate);

    expect(httpMock.getWeekFixtures).toHaveBeenCalledWith(testDate);
    expect(store.weekFixtures()).toBe(weekFixtures);
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should expose loading state while loading a new week', () => {
    const response$ = new Subject<FixturesWeekData>();

    httpMock.getWeekFixtures.mockReturnValue(response$);

    store.loadWeekFixtures(testDate);

    expect(store.isLoading()).toBe(true);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(true);

    response$.next(createWeekFixtures());

    expect(store.isLoading()).toBe(false);
    expect(store.isPending()).toBe(false);
  });

  it('should preserve existing fixtures while refreshing', () => {
    const currentWeek = createWeekFixtures();
    const refreshedWeek = createWeekFixtures();
    const refresh$ = new Subject<FixturesWeekData>();

    httpMock.getWeekFixtures
      .mockReturnValueOnce(of(currentWeek))
      .mockReturnValueOnce(refresh$);

    store.loadWeekFixtures(testDate);
    store.loadWeekFixtures(testDate, true);

    expect(store.weekFixtures()).toBe(currentWeek);
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(true);
    expect(store.isPending()).toBe(true);

    refresh$.next(refreshedWeek);

    expect(store.weekFixtures()).toBe(refreshedWeek);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
  });

  it('should ignore the response of an outdated request', () => {
    const firstRequest$ = new Subject<FixturesWeekData>();
    const secondRequest$ = new Subject<FixturesWeekData>();

    const firstWeek = createWeekFixtures();
    const secondWeek = createWeekFixtures();

    httpMock.getWeekFixtures
      .mockReturnValueOnce(firstRequest$)
      .mockReturnValueOnce(secondRequest$);

    store.loadWeekFixtures(testDate);
    store.loadWeekFixtures(nextWeekDate);

    secondRequest$.next(secondWeek);
    firstRequest$.next(firstWeek);

    expect(store.weekFixtures()).toBe(secondWeek);
  });

  it('should preserve existing fixtures when refreshing fails', async () => {
    jest.useFakeTimers();

    const currentWeek = createWeekFixtures();
    const error = new Error('Failed to refresh fixtures');

    httpMock.getWeekFixtures
      .mockReturnValueOnce(of(currentWeek))
      .mockReturnValueOnce(throwError(() => error));

    store.loadWeekFixtures(testDate);
    store.loadWeekFixtures(testDate, true);

    await jest.runAllTimersAsync();

    expect(store.weekFixtures()).toBe(currentWeek);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBe(error);
  });
});

function createWeekFixtures(): FixturesWeekData {
  return Array.from({ length: daysPerWeek }, () => []);
}
