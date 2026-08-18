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
import { type ExtendedFixtureDTO, type FixturesWeekData } from '@lib/models';
import { getWeekdayIndex } from '@lib/shared';

import { OverviewComponent } from './overview.component';
import { SelectedDateService, VisibilityObserverService } from './services';
import { WeekFixturesStore, WeekStandingsStore } from './stores';

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
    weekFixtures: Signal<FixturesWeekData>;
    isPending: Signal<boolean>;
    loadWeekFixtures: jest.Mock;
  };

  let weekStandingsStoreMock: {
    isPending: Signal<boolean>;
    loadWeekStandings: jest.Mock;
  };

  const testDate = '2023-11-02';

  let selectedDay: WritableSignal<string>;
  let weekFixtures: WritableSignal<FixturesWeekData>;

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

    weekFixtures = signal<FixturesWeekData>([[], [], [], [], [], [], []]);

    fixturesLoading = signal(false);
    fixturesRefreshing = signal(false);

    standingsLoading = signal(false);
    standingsRefreshing = signal(false);

    weekFixturesStoreMock = {
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
    });

    it('should stop services on destroy', () => {
      fixture.detectChanges();
      TestBed.tick();

      pageRefreshServiceMock.stop.mockClear();

      fixture.destroy();

      expect(visibilityObserverServiceMock.stop).toHaveBeenCalledTimes(1);
      expect(pageRefreshServiceMock.stop).toHaveBeenCalledTimes(1);
    });

    it('should not start services multiple times while already active', () => {
      fixture.detectChanges();

      component.onRouteAttach();
      component.onRouteAttach();

      expect(visibilityObserverServiceMock.init).toHaveBeenCalledTimes(1);
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

    it('should stop services when route is detached', () => {
      fixture.detectChanges();
      TestBed.tick();

      pageRefreshServiceMock.stop.mockClear();

      component.onRouteDetach();

      expect(visibilityObserverServiceMock.stop).toHaveBeenCalledTimes(1);
      expect(pageRefreshServiceMock.stop).toHaveBeenCalledTimes(1);
    });

    it('should restart page refresh when route is attached with playing fixtures', () => {
      fixture.detectChanges();
      component.onRouteDetach();

      setPlayingFixture();
      TestBed.tick();

      pageRefreshServiceMock.init.mockClear();

      component.onRouteAttach();
      TestBed.tick();

      expect(pageRefreshServiceMock.init).toHaveBeenCalledTimes(1);
    });

    it('should not start page refresh while route is detached', () => {
      fixture.detectChanges();
      component.onRouteDetach();

      pageRefreshServiceMock.init.mockClear();

      setPlayingFixture();
      TestBed.tick();

      expect(pageRefreshServiceMock.init).not.toHaveBeenCalled();
    });
  });

  describe('page refresh', () => {
    it('should provide refresh configuration to PageRefreshService', () => {
      startPageRefresh();

      expect(pageRefreshServiceMock.init).toHaveBeenCalledWith({
        isPlaying: expect.any(Function),
        canRefresh: expect.any(Function),
        refresh: expect.any(Function),
      });
    });

    it('should allow refresh when fixtures and standings are not pending', () => {
      startPageRefresh();

      const config = getPageRefreshConfig();

      expect(config.canRefresh()).toBe(true);
    });

    it('should prevent refresh while fixtures are loading', () => {
      startPageRefresh();

      const config = getPageRefreshConfig();

      fixturesLoading.set(true);

      expect(config.canRefresh()).toBe(false);
    });

    it('should prevent refresh while standings are loading', () => {
      startPageRefresh();

      const config = getPageRefreshConfig();

      standingsLoading.set(true);

      expect(config.canRefresh()).toBe(false);
    });

    it('should prevent refresh while fixtures are refreshing', () => {
      startPageRefresh();

      const config = getPageRefreshConfig();

      fixturesRefreshing.set(true);

      expect(config.canRefresh()).toBe(false);
    });

    it('should prevent refresh while standings are refreshing', () => {
      startPageRefresh();

      const config = getPageRefreshConfig();

      standingsRefreshing.set(true);

      expect(config.canRefresh()).toBe(false);
    });

    it('should reload fixtures and standings for the selected day', async () => {
      startPageRefresh();

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
  });

  const setPlayingFixture = (): void => {
    const weekdayIndex = getWeekdayIndex(testDate);

    weekFixtures.update((week) => {
      const updated = [...week];

      updated[weekdayIndex] = [
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

  const startPageRefresh = (): void => {
    fixture.detectChanges();

    setPlayingFixture();

    TestBed.tick();

    expect(pageRefreshServiceMock.init).toHaveBeenCalled();
  };

  const getPageRefreshConfig = () => {
    return pageRefreshServiceMock.init.mock.calls.at(-1)[0];
  };
});
