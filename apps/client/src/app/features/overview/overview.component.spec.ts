import {
  computed,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import {
  LeagueService,
  PageRefreshService,
  RouteService,
  type CompetitionData,
} from '@app/shared';
import type { ExtendedFixtureDTO, FixturesWeekData } from '@lib/models';
import { formatCalendarWeekKey, getWeekdayIndex } from '@lib/shared';

import { OverviewComponent } from './overview.component';
import { SelectedDateService, VisibilityObserverService } from './services';
import { WeekFixturesStore, WeekStandingsStore } from './stores';

const testDate = '2023-11-02';
const testWeekMonday = '2023-10-30';
const previousSunday = '2023-10-29';
const nextMonday = '2023-11-06';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  let routeServiceMock: {
    url: Signal<string | undefined>;
  };

  let leagueServiceMock: {
    selectedLeague: WritableSignal<CompetitionData | undefined>;
    setSelectedLeague: jest.Mock;
  };

  let pageRefreshServiceMock: {
    init: jest.Mock;
    pause: jest.Mock;
    stop: jest.Mock;
    hasPlayingState: jest.Mock;
  };

  let visibilityObserverServiceMock: {
    init: jest.Mock;
    stop: jest.Mock;
  };

  let selectedDateServiceMock: {
    selectedDay: Signal<string>;
  };

  let weekFixturesStoreMock: {
    weekKey: Signal<string | null>;
    weekFixtures: Signal<FixturesWeekData>;
    isPending: Signal<boolean>;
    loadWeekFixtures: jest.Mock;
  };

  let weekStandingsStoreMock: {
    isPending: Signal<boolean>;
    loadWeekStandings: jest.Mock;
  };

  let selectedDay: WritableSignal<string>;
  let weekFixtures: WritableSignal<FixturesWeekData>;
  let cachedWeekKey: WritableSignal<string | null>;

  let fixturesLoading: WritableSignal<boolean>;
  let fixturesRefreshing: WritableSignal<boolean>;

  let standingsLoading: WritableSignal<boolean>;
  let standingsRefreshing: WritableSignal<boolean>;

  beforeEach(() => {
    routeServiceMock = {
      url: signal<string | undefined>(undefined),
    };

    leagueServiceMock = {
      selectedLeague: signal<CompetitionData | undefined>(undefined),
      setSelectedLeague: jest.fn(),
    };

    pageRefreshServiceMock = {
      init: jest.fn(),
      pause: jest.fn(),
      stop: jest.fn(),
      hasPlayingState: jest
        .fn()
        .mockImplementation((states: string[]) => states.includes('2H')),
    };

    visibilityObserverServiceMock = {
      init: jest.fn(),
      stop: jest.fn(),
    };

    selectedDay = signal(testDate);

    selectedDateServiceMock = {
      selectedDay,
    };

    weekFixtures = signal<FixturesWeekData>([
      [], // previous Sunday
      [], // Monday
      [], // Tuesday
      [], // Wednesday
      [], // Thursday
      [], // Friday
      [], // Saturday
      [], // Sunday
      [], // next Monday
    ]);

    fixturesLoading = signal(false);
    fixturesRefreshing = signal(false);

    standingsLoading = signal(false);
    standingsRefreshing = signal(false);

    cachedWeekKey = signal(formatCalendarWeekKey(testDate));

    weekFixturesStoreMock = {
      weekKey: cachedWeekKey,
      weekFixtures,
      isPending: computed(() => fixturesLoading() || fixturesRefreshing()),
      loadWeekFixtures: jest.fn(),
    };

    weekStandingsStoreMock = {
      isPending: computed(() => standingsLoading() || standingsRefreshing()),
      loadWeekStandings: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [
        {
          provide: RouteService,
          useValue: routeServiceMock,
        },
        {
          provide: LeagueService,
          useValue: leagueServiceMock,
        },
      ],
    });

    TestBed.overrideComponent(OverviewComponent, {
      set: {
        imports: [],
        template: '',
      },
    });

    TestBed.overrideProvider(PageRefreshService, {
      useValue: pageRefreshServiceMock,
    });

    TestBed.overrideProvider(VisibilityObserverService, {
      useValue: visibilityObserverServiceMock,
    });

    TestBed.overrideProvider(SelectedDateService, {
      useValue: selectedDateServiceMock,
    });

    TestBed.overrideProvider(WeekFixturesStore, {
      useValue: weekFixturesStoreMock,
    });

    TestBed.overrideProvider(WeekStandingsStore, {
      useValue: weekStandingsStoreMock,
    });

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
  });

  describe('lifecycle', () => {
    it('should start services on init', () => {
      fixture.detectChanges();

      expect(visibilityObserverServiceMock.init).toHaveBeenCalledTimes(1);
      expect(pageRefreshServiceMock.init).toHaveBeenCalledTimes(1);
    });

    it('should stop services on destroy', () => {
      fixture.detectChanges();

      pageRefreshServiceMock.pause.mockClear();
      pageRefreshServiceMock.stop.mockClear();

      fixture.destroy();

      expect(visibilityObserverServiceMock.stop).toHaveBeenCalledTimes(1);
      expect(pageRefreshServiceMock.stop).toHaveBeenCalledTimes(1);
      expect(pageRefreshServiceMock.pause).not.toHaveBeenCalled();
    });
  });

  describe('route reuse', () => {
    it('should initialize visibility observer when route is attached', () => {
      fixture.detectChanges();
      component.onRouteDetach();

      visibilityObserverServiceMock.init.mockClear();

      component.onRouteAttach();

      expect(visibilityObserverServiceMock.init).toHaveBeenCalledTimes(1);
    });

    it('should pause services when route is detached', () => {
      fixture.detectChanges();

      pageRefreshServiceMock.pause.mockClear();
      pageRefreshServiceMock.stop.mockClear();

      component.onRouteDetach();

      expect(visibilityObserverServiceMock.stop).toHaveBeenCalledTimes(1);
      expect(pageRefreshServiceMock.pause).toHaveBeenCalledTimes(1);
      expect(pageRefreshServiceMock.stop).not.toHaveBeenCalled();
    });

    it('should start services when route is attached', () => {
      fixture.detectChanges();
      component.onRouteDetach();

      visibilityObserverServiceMock.init.mockClear();
      pageRefreshServiceMock.init.mockClear();

      component.onRouteAttach();

      expect(visibilityObserverServiceMock.init).toHaveBeenCalledTimes(1);
      expect(pageRefreshServiceMock.init).toHaveBeenCalledTimes(1);
    });
  });

  describe('page refresh', () => {
    it('should provide refresh configuration to PageRefreshService', () => {
      fixture.detectChanges();

      expect(pageRefreshServiceMock.init).toHaveBeenCalledWith({
        isPlaying: expect.any(Function),
        canRefresh: expect.any(Function),
        refresh: expect.any(Function),
      });
    });

    it('should report playing fixtures for the selected day', () => {
      fixture.detectChanges();

      const config = getPageRefreshConfig();

      expect(config.isPlaying()).toBe(false);

      setPlayingFixture();

      expect(config.isPlaying()).toBe(true);
    });

    it('should allow refresh when fixtures and standings are not pending', () => {
      fixture.detectChanges();

      const config = getPageRefreshConfig();

      expect(config.canRefresh()).toBe(true);
    });

    it('should prevent refresh while fixtures are loading', () => {
      fixture.detectChanges();

      const config = getPageRefreshConfig();

      fixturesLoading.set(true);

      expect(config.canRefresh()).toBe(false);
    });

    it('should prevent refresh while standings are loading', () => {
      fixture.detectChanges();

      const config = getPageRefreshConfig();

      standingsLoading.set(true);

      expect(config.canRefresh()).toBe(false);
    });

    it('should prevent refresh while fixtures are refreshing', () => {
      fixture.detectChanges();

      const config = getPageRefreshConfig();

      fixturesRefreshing.set(true);

      expect(config.canRefresh()).toBe(false);
    });

    it('should prevent refresh while standings are refreshing', () => {
      fixture.detectChanges();

      const config = getPageRefreshConfig();

      standingsRefreshing.set(true);

      expect(config.canRefresh()).toBe(false);
    });

    it('should reload fixtures and standings for the selected day', async () => {
      fixture.detectChanges();

      const config = getPageRefreshConfig();

      await config.refresh();

      expect(weekFixturesStoreMock.loadWeekFixtures).toHaveBeenCalledWith(
        testDate,
        true
      );

      expect(weekStandingsStoreMock.loadWeekStandings).toHaveBeenCalledWith(
        testDate,
        true
      );
    });

    it('should report playing fixtures for the next monday edge day', () => {
      selectedDay.set(nextMonday);
      cachedWeekKey.set(formatCalendarWeekKey(testDate));

      fixture.detectChanges();

      const config = getPageRefreshConfig();

      expect(config.isPlaying()).toBe(false);

      const NEXT_DAY_INDEX = 8;
      setPlayingFixtureAtStoreIndex(NEXT_DAY_INDEX);

      expect(config.isPlaying()).toBe(true);
    });

    it('should report playing fixtures for the previous sunday edge day', () => {
      selectedDay.set(previousSunday);
      cachedWeekKey.set(formatCalendarWeekKey(testWeekMonday));

      fixture.detectChanges();

      const config = getPageRefreshConfig();

      expect(config.isPlaying()).toBe(false);

      const PREVIOUS_DAY_INDEX = 0;
      setPlayingFixtureAtStoreIndex(PREVIOUS_DAY_INDEX);

      expect(config.isPlaying()).toBe(true);
    });
  });

  const setPlayingFixture = (): void => {
    setPlayingFixtureAtStoreIndex(getWeekdayIndex(testDate) + 1);
  };

  const setPlayingFixtureAtStoreIndex = (storeIndex: number): void => {
    weekFixtures.update((week) => {
      const updated = [...week];

      updated[storeIndex] = [
        {
          fixture: {
            status: {
              short: '2H',
            },
          },
        } as ExtendedFixtureDTO,
      ];

      return updated;
    });
  };

  const getPageRefreshConfig = () => {
    return pageRefreshServiceMock.init.mock.calls.at(-1)[0];
  };
});
