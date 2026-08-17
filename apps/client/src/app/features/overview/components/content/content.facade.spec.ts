import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { DateString } from '@lib/shared';

import { DateService, SelectedDateService } from '../../services';
import { WeekFixturesStore, WeekStandingsStore } from '../../store';

import { OverviewContentFacade } from './content.facade';

describe('OverviewContentFacade', () => {
  const selectedDay = signal<DateString>('2026-08-10');

  const selectedDateServiceMock = {
    selectedDay: selectedDay.asReadonly(),
    setSelectedDay: jest.fn(),
  };

  const dateServiceMock = {
    selectedTabIndex: signal(0),
  };

  const fixturesStoreMock = {
    weekFixtures: signal([]),
    isLoading: signal(false),
    error: signal<string | null>(null),
    loadWeekFixtures: jest.fn(),
  };

  const standingsStoreMock = {
    weekStandings: signal([]),
    isLoading: signal(false),
    error: signal(null),
    loadWeekStandings: jest.fn(),
  };

  beforeEach(() => {
    selectedDay.set('2026-08-10');

    fixturesStoreMock.loadWeekFixtures.mockClear();
    standingsStoreMock.loadWeekStandings.mockClear();

    TestBed.configureTestingModule({
      providers: [
        OverviewContentFacade,
        {
          provide: SelectedDateService,
          useValue: selectedDateServiceMock,
        },
        {
          provide: DateService,
          useValue: dateServiceMock,
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
      '2026-08-10'
    );

    expect(standingsStoreMock.loadWeekStandings).toHaveBeenCalledWith(
      '2026-08-10'
    );
  });

  it('should not reload the week when selected day changes within the same week', () => {
    TestBed.inject(OverviewContentFacade);
    TestBed.tick();

    fixturesStoreMock.loadWeekFixtures.mockClear();
    standingsStoreMock.loadWeekStandings.mockClear();

    selectedDay.set('2026-08-12');
    TestBed.tick();

    expect(fixturesStoreMock.loadWeekFixtures).not.toHaveBeenCalled();
    expect(standingsStoreMock.loadWeekStandings).not.toHaveBeenCalled();
  });

  it('should reload fixtures and standings when selected day changes to another week', () => {
    TestBed.inject(OverviewContentFacade);
    TestBed.tick();

    fixturesStoreMock.loadWeekFixtures.mockClear();
    standingsStoreMock.loadWeekStandings.mockClear();

    selectedDay.set('2026-08-17');
    TestBed.tick();

    expect(fixturesStoreMock.loadWeekFixtures).toHaveBeenCalledWith(
      '2026-08-17'
    );

    expect(standingsStoreMock.loadWeekStandings).toHaveBeenCalledWith(
      '2026-08-17'
    );
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
});
