import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type {
  ExtendedFixtureDTO,
  FixturesWeekData,
  StandingsDTO,
  StandingsWeekData,
} from '@lib/models';
import {
  COMPETITION_ID,
  formatCalendarWeekKey,
  type DateString,
} from '@lib/shared';

import { EXAMPLE_FIXTURE } from '../../../../../testing/fixtures.mock';
import { DateNavigationService, SelectedDateService } from '../../services';
import { WeekFixturesStore, WeekStandingsStore } from '../../stores';

import { OverviewContentFacade } from './content.facade';

describe('OverviewContentFacade', () => {
  const initialDate: DateString = '2026-08-10';
  const sameWeekDate: DateString = '2026-08-12';

  const previousSunday: DateString = '2026-08-09';
  const currentSunday: DateString = '2026-08-16';
  const nextMonday: DateString = '2026-08-17';

  const selectedDay = signal<DateString>(initialDate);

  const selectedDateServiceMock = {
    selectedDay: selectedDay.asReadonly(),
    setSelectedDay: jest.fn(),
  };

  const selectedTabIndex = signal(0);

  const dateNavigationServiceMock = {
    selectedTabIndex: selectedTabIndex.asReadonly(),
  };

  const fixturesStoreMock = {
    weekKey: signal<string | null>(null),
    weekFixtures: signal<FixturesWeekData>(createEmptyFixturesWeekData()),
    isLoading: signal(false),
    error: signal<string | null>(null),
    loadWeekFixtures: jest.fn(),
  };

  const standingsStoreMock = {
    weekKey: signal<string | null>(null),
    weekStandings: signal<StandingsWeekData>(createEmptyStandingsWeekData()),
    isLoading: signal(false),
    error: signal<string | null>(null),
    loadWeekStandings: jest.fn(),
  };

  beforeEach(() => {
    selectedDay.set(initialDate);
    selectedTabIndex.set(0);

    fixturesStoreMock.weekKey.set(null);
    standingsStoreMock.weekKey.set(null);

    fixturesStoreMock.weekFixtures.set(createEmptyFixturesWeekData());
    standingsStoreMock.weekStandings.set(createEmptyStandingsWeekData());

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

    selectedDay.set(nextMonday);
    TestBed.tick();

    expect(fixturesStoreMock.loadWeekFixtures).toHaveBeenCalledWith(nextMonday);
    expect(standingsStoreMock.loadWeekStandings).toHaveBeenCalledWith(
      nextMonday
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

  describe('week data mapping', () => {
    it('should expose empty weekday data during the initial load', () => {
      fixturesStoreMock.isLoading.set(true);

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      expect(facade.weekFixtures()).toEqual([[], [], [], [], [], [], []]);

      expect(facade.hasFixturesDataForSelectedDay()).toBe(false);
    });

    it('should map the nine loaded fixture days to the seven visible weekdays', () => {
      const weekData = createIndexedFixturesWeekData();

      fixturesStoreMock.weekFixtures.set(weekData);
      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      expect(facade.weekFixtures()).toEqual(weekData.slice(1, 8));
    });

    it('should keep the edge monday visible while the next week is loading', () => {
      const weekData = createIndexedFixturesWeekData();

      fixturesStoreMock.weekFixtures.set(weekData);
      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(nextMonday);
      selectedTabIndex.set(0);
      fixturesStoreMock.isLoading.set(true);

      TestBed.tick();

      expect(facade.weekFixtures()[0]).toBe(weekData[8]);
      expect(facade.hasFixturesDataForSelectedDay()).toBe(true);
    });

    it('should keep the edge sunday visible while the previous week is loading', () => {
      const currentWeekDate: DateString = '2026-08-17';

      const weekData = createIndexedFixturesWeekData();

      fixturesStoreMock.weekFixtures.set(weekData);
      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(currentWeekDate));

      selectedDay.set(currentWeekDate);

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(currentSunday);
      selectedTabIndex.set(6);
      fixturesStoreMock.isLoading.set(true);

      TestBed.tick();

      expect(facade.weekFixtures()[6]).toBe(weekData[0]);
      expect(facade.hasFixturesDataForSelectedDay()).toBe(true);
    });

    it('should replace edge monday data with regular monday data when the next week finishes loading', () => {
      const currentWeekData = createIndexedFixturesWeekData();
      const nextWeekData = createIndexedFixturesWeekData(100);

      fixturesStoreMock.weekFixtures.set(currentWeekData);
      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(nextMonday);
      selectedTabIndex.set(0);
      fixturesStoreMock.isLoading.set(true);

      TestBed.tick();

      expect(facade.weekFixtures()[0]).toBe(currentWeekData[8]);

      fixturesStoreMock.weekFixtures.set(nextWeekData);
      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(nextMonday));
      fixturesStoreMock.isLoading.set(false);

      TestBed.tick();

      expect(facade.weekFixtures()[0]).toBe(nextWeekData[1]);
      expect(facade.hasFixturesDataForSelectedDay()).toBe(true);
    });

    it('should not expose cached data for a selected day outside the edge-day range', () => {
      const dateOutsideEdgeRange: DateString = '2026-08-18';
      const weekData = createIndexedFixturesWeekData();

      fixturesStoreMock.weekFixtures.set(weekData);
      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(dateOutsideEdgeRange);
      selectedTabIndex.set(1);

      TestBed.tick();

      expect(facade.hasFixturesDataForSelectedDay()).toBe(false);
      expect(facade.weekFixtures()[1]).toBeUndefined();
    });
  });

  describe('edge-day availability', () => {
    it('should report fixture data as available for the previous sunday edge day', () => {
      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(previousSunday);

      expect(facade.hasFixturesDataForSelectedDay()).toBe(true);
    });

    it('should report fixture data as available for the next monday edge day', () => {
      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(nextMonday);

      expect(facade.hasFixturesDataForSelectedDay()).toBe(true);
    });

    it('should report fixture data as unavailable before the previous sunday', () => {
      const dateBeforeEdgeRange: DateString = '2026-08-08';

      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(dateBeforeEdgeRange);

      expect(facade.hasFixturesDataForSelectedDay()).toBe(false);
    });

    it('should report fixture data as unavailable after the next monday', () => {
      const dateAfterEdgeRange: DateString = '2026-08-18';

      fixturesStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(dateAfterEdgeRange);

      expect(facade.hasFixturesDataForSelectedDay()).toBe(false);
    });

    it('should keep standings edge-day data available while the next week is loading', () => {
      const weekData = createIndexedStandingsWeekData();

      standingsStoreMock.weekStandings.set(weekData);
      standingsStoreMock.weekKey.set(formatCalendarWeekKey(initialDate));

      const facade = TestBed.inject(OverviewContentFacade);
      TestBed.tick();

      selectedDay.set(nextMonday);
      selectedTabIndex.set(0);
      standingsStoreMock.isLoading.set(true);

      TestBed.tick();

      expect(facade.weekStandings()[0]).toBe(weekData[8]);
      expect(facade.hasStandingsDataForSelectedDay()).toBe(true);
    });
  });

  const markWeekAsCached = (date: DateString): void => {
    const weekKey = formatCalendarWeekKey(date);

    fixturesStoreMock.weekKey.set(weekKey);
    standingsStoreMock.weekKey.set(weekKey);
  };
});

function createEmptyFixturesWeekData(): FixturesWeekData {
  return Array.from({ length: 9 }, () => []);
}

function createEmptyStandingsWeekData(): StandingsWeekData {
  return Array.from({ length: 9 }, () => []);
}

function createIndexedFixturesWeekData(startId = 0): FixturesWeekData {
  return Array.from({ length: 9 }, (_, index) => [
    {
      ...EXAMPLE_FIXTURE,
      fixture: {
        ...EXAMPLE_FIXTURE.fixture,
        id: startId + index,
      },
    } as ExtendedFixtureDTO,
  ]);
}

function createIndexedStandingsWeekData(): StandingsWeekData {
  return Array.from({ length: 9 }, () => [createStandings()]);
}

function createStandings(): StandingsDTO {
  return {
    _id: 'test-1',
    league: {
      id: COMPETITION_ID.GERMANY_BUNDESLIGA,
      name: 'Bundesliga',
      country: 'Germany',
      logo: 'bundesliga-logo',
      flag: 'germany-flag',
      season: 2026,
      standings: [],
    },
    createdAt: new Date('2026-08-10'),
    updatedAt: new Date('2026-08-10'),
  };
}
