import {
  computed,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RefreshRegistryService, type RefreshTarget } from '@app/shared';
import type { ExtendedFixtureDTO, FixturesWeekData } from '@lib/models';
import { formatCalendarWeekKey, getWeekdayIndex } from '@lib/shared';

import { WeekFixturesStore, WeekStandingsStore } from '../stores';

import { DateNavigationService } from './date-navigation.service';
import { OverviewRefreshService } from './overview-refresh.service';
import { SelectedDateService } from './selected-date.service';

const testDate = '2023-11-02';
const nextMonday = '2023-11-06';

describe('OverviewRefreshService', () => {
  let service: OverviewRefreshService;

  let registeredTarget: RefreshTarget | undefined;

  let selectedDay: WritableSignal<string>;
  let weekFixtures: WritableSignal<FixturesWeekData>;
  let cachedWeekKey: WritableSignal<string | null>;

  let fixturesLoading: WritableSignal<boolean>;
  let fixturesRefreshing: WritableSignal<boolean>;

  let standingsLoading: WritableSignal<boolean>;
  let standingsRefreshing: WritableSignal<boolean>;

  const refreshRegistryMock = {
    register: jest.fn(),
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

  const dateNavigationServiceMock = {
    today: signal(testDate),
    resetToday: jest.fn(),
  };

  beforeEach(() => {
    registeredTarget = undefined;

    refreshRegistryMock.register.mockReset();
    refreshRegistryMock.register.mockImplementation((target: RefreshTarget) => {
      registeredTarget = target;

      return jest.fn();
    });

    selectedDay = signal(testDate);

    selectedDateServiceMock = {
      selectedDay,
    };

    weekFixtures = signal<FixturesWeekData>([
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ]);

    cachedWeekKey = signal(formatCalendarWeekKey(testDate));

    fixturesLoading = signal(false);
    fixturesRefreshing = signal(false);

    standingsLoading = signal(false);
    standingsRefreshing = signal(false);

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

    dateNavigationServiceMock.today.set(testDate);
    dateNavigationServiceMock.resetToday.mockReset();

    TestBed.configureTestingModule({
      providers: [
        OverviewRefreshService,
        {
          provide: RefreshRegistryService,
          useValue: refreshRegistryMock,
        },
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
          useValue: weekFixturesStoreMock,
        },
        {
          provide: WeekStandingsStore,
          useValue: weekStandingsStoreMock,
        },
      ],
    });

    service = TestBed.inject(OverviewRefreshService);
  });

  describe('lifecycle', () => {
    it('should register overview refresh target', () => {
      service.init();

      expect(refreshRegistryMock.register).toHaveBeenCalledWith({
        id: 'overview',
        isLive: expect.any(Function),
        canRefresh: expect.any(Function),
        refresh: expect.any(Function),
      });
    });

    it('should not register multiple overview targets', () => {
      service.init();
      service.init();

      expect(refreshRegistryMock.register).toHaveBeenCalledTimes(1);
    });

    it('should unregister overview refresh target on destroy', () => {
      const unregister = jest.fn();

      refreshRegistryMock.register.mockReturnValue(unregister);

      service.init();
      service.destroy();

      expect(unregister).toHaveBeenCalledTimes(1);
    });
  });

  describe('live state', () => {
    it('should report no live fixtures for today', () => {
      service.init();
      TestBed.tick();

      expect(getTarget().isLive()).toBe(false);
    });

    it('should report live fixtures for today', () => {
      service.init();
      TestBed.tick();

      setLiveFixture();
      TestBed.tick();

      expect(getTarget().isLive()).toBe(true);
    });

    it('should keep today live state when another day is selected', () => {
      service.init();
      TestBed.tick();

      setLiveFixture();
      TestBed.tick();

      expect(getTarget().isLive()).toBe(true);

      selectedDay.set(nextMonday);
      TestBed.tick();

      expect(getTarget().isLive()).toBe(true);
    });
  });

  describe('refresh availability', () => {
    it('should allow refresh when fixtures and standings are not pending', () => {
      service.init();

      expect(getTarget().canRefresh()).toBe(true);
    });

    it('should prevent refresh while fixtures are loading', () => {
      service.init();

      fixturesLoading.set(true);

      expect(getTarget().canRefresh()).toBe(false);
    });

    it('should prevent refresh while fixtures are refreshing', () => {
      service.init();

      fixturesRefreshing.set(true);

      expect(getTarget().canRefresh()).toBe(false);
    });

    it('should prevent refresh while standings are loading', () => {
      service.init();

      standingsLoading.set(true);

      expect(getTarget().canRefresh()).toBe(false);
    });

    it('should prevent refresh while standings are refreshing', () => {
      service.init();

      standingsRefreshing.set(true);

      expect(getTarget().canRefresh()).toBe(false);
    });

    it('should prevent refresh when today is not selected', () => {
      service.init();

      selectedDay.set(nextMonday);

      expect(getTarget().canRefresh()).toBe(false);
    });
  });

  describe('refresh', () => {
    it('should reload fixtures and standings for the selected day', async () => {
      service.init();

      await getTarget().refresh();

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

  const setLiveFixture = (): void => {
    setLiveFixtureAtStoreIndex(getWeekdayIndex(testDate) + 1);
  };

  const setLiveFixtureAtStoreIndex = (storeIndex: number): void => {
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

  const getTarget = (): RefreshTarget => {
    if (!registeredTarget) {
      throw new Error('Refresh target was not registered');
    }

    return registeredTarget;
  };
});
