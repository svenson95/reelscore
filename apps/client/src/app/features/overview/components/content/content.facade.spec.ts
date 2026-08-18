import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { formatCalendarWeekKey, type DateString } from '@lib/shared';

import { DateNavigationService, SelectedDateService } from '../../services';
import { WeekFixturesStore, WeekStandingsStore } from '../../stores';

import { OverviewContentFacade } from './content.facade';

describe('OverviewContentFacade', () => {
  const initialDate: DateString = '2026-08-10';
  const sameWeekDate: DateString = '2026-08-12';
  const nextWeekDate: DateString = '2026-08-17';

  const selectedDay = signal<DateString>(initialDate);

  const selectedDateServiceMock = {
    selectedDay: selectedDay.asReadonly(),
    setSelectedDay: jest.fn(),
  };

  const dateNavigationServiceMock = {
    selectedTabIndex: signal(0),
  };

  const fixturesStoreMock = {
    weekKey: signal<string | null>(null),
    weekFixtures: signal([]),
    isLoading: signal(false),
    error: signal<string | null>(null),
    loadWeekFixtures: jest.fn(),
  };

  const standingsStoreMock = {
    weekKey: signal<string | null>(null),
    weekStandings: signal([]),
    isLoading: signal(false),
    error: signal<string | null>(null),
    loadWeekStandings: jest.fn(),
  };

  beforeEach(() => {
    selectedDay.set(initialDate);

    fixturesStoreMock.weekKey.set(null);
    standingsStoreMock.weekKey.set(null);

    fixturesStoreMock.loadWeekFixtures.mockClear();
    standingsStoreMock.loadWeekStandings.mockClear();

    fixturesStoreMock.isLoading.set(false);
    standingsStoreMock.isLoading.set(false);

    fixturesStoreMock.error.set(null);
    standingsStoreMock.error.set(null);

    TestBed.configureTestingModule({
      providers: [
        OverviewContentFacade,
        {
          provide: SelectedDateService,
          useValue: selectedDateServiceMock,
        },
        {
          provide: DateNavigationService,
          useValue: dateNavigationServiceMock,
        },
        {
          provide: WeekFixturesStore,
          useValue: fixturesStoreMock,
        },
        {
          provide: WeekStandingsStore,
          useValue: standingsStoreMock,
        },
      ],
    });
  });

  it('should load fixtures and standings for the selected week', () => {
    TestBed.inject(OverviewContentFacade);
    TestBed.tick();

    expect(fixturesStoreMock.loadWeekFixtures).toHaveBeenCalledWith(
      initialDate
    );
    expect(standingsStoreMock.loadWeekStandings).toHaveBeenCalledWith(
      initialDate
    );
  });

  it('should not reload the week when selected day changes within the same week', () => {
    TestBed.inject(OverviewContentFacade);
    TestBed.tick();

    markWeekAsCached(initialDate);

    fixturesStoreMock.loadWeekFixtures.mockClear();
    standingsStoreMock.loadWeekStandings.mockClear();

    selectedDay.set(sameWeekDate);
    TestBed.tick();

    expect(fixturesStoreMock.loadWeekFixtures).not.toHaveBeenCalled();
    expect(standingsStoreMock.loadWeekStandings).not.toHaveBeenCalled();
  });

  it('should reload fixtures and standings when selected day changes to another week', () => {
    TestBed.inject(OverviewContentFacade);
    TestBed.tick();

    markWeekAsCached(initialDate);

    fixturesStoreMock.loadWeekFixtures.mockClear();
    standingsStoreMock.loadWeekStandings.mockClear();

    selectedDay.set(nextWeekDate);
    TestBed.tick();

    expect(fixturesStoreMock.loadWeekFixtures).toHaveBeenCalledWith(
      nextWeekDate
    );

    expect(standingsStoreMock.loadWeekStandings).toHaveBeenCalledWith(
      nextWeekDate
    );
  });

  it('should not load when the selected week is already cached', () => {
    markWeekAsCached(initialDate);

    TestBed.inject(OverviewContentFacade);
    TestBed.tick();

    expect(fixturesStoreMock.loadWeekFixtures).not.toHaveBeenCalled();
    expect(standingsStoreMock.loadWeekStandings).not.toHaveBeenCalled();
  });

  it('should expose fixture and standings loading states independently', () => {
    const facade = TestBed.inject(OverviewContentFacade);
    TestBed.tick();

    fixturesStoreMock.isLoading.set(true);
    standingsStoreMock.isLoading.set(false);

    expect(facade.fixturesLoading()).toBe(true);
    expect(facade.standingsLoading()).toBe(false);

    fixturesStoreMock.isLoading.set(false);
    standingsStoreMock.isLoading.set(true);

    expect(facade.fixturesLoading()).toBe(false);
    expect(facade.standingsLoading()).toBe(true);
  });

  it('should expose fixture and standings errors independently', () => {
    const facade = TestBed.inject(OverviewContentFacade);
    TestBed.tick();

    fixturesStoreMock.error.set('Fixtures failed');
    standingsStoreMock.error.set(null);

    expect(facade.fixturesError()).toEqual('Fixtures failed');
    expect(facade.standingsError()).toBeNull();
  });

  const markWeekAsCached = (date: DateString): void => {
    const weekKey = formatCalendarWeekKey(date);

    fixturesStoreMock.weekKey.set(weekKey);
    standingsStoreMock.weekKey.set(weekKey);
  };
});
