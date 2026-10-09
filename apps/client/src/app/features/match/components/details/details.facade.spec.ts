import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { GetFixtureDTO } from '@reelscore-sdk/models';

import { EXAMPLE_FIXTURE } from '@testing/client';

import {
  AnalysesStore,
  EvaluationsStore,
  EventsStore,
  FixtureStandingsStore,
  FixtureStore,
  LatestFixturesStore,
  StatisticsStore,
  TeamCoachesStore,
} from '../../state';

import { MatchDetailsFacade } from './details.facade';

describe('MatchDetailsFacade', () => {
  const fixtureState = signal<GetFixtureDTO | null>(null);
  const isFixtureLoading = signal(false);

  const createResourceState = () => ({
    value: signal<unknown>(null),
    isLoading: signal(false),
    error: signal<unknown>(null),
  });

  let standings: ReturnType<typeof createResourceState>;
  let evaluations: ReturnType<typeof createResourceState>;
  let latestFixtures: ReturnType<typeof createResourceState>;
  let facade: MatchDetailsFacade;

  const configureTestingModule = () => {
    TestBed.configureTestingModule({
      providers: [
        MatchDetailsFacade,
        {
          provide: FixtureStore,
          useValue: { fixture: fixtureState, isLoading: isFixtureLoading },
        },
        {
          provide: FixtureStandingsStore,
          useValue: { standings: standings.value, ...standings },
        },
        {
          provide: EvaluationsStore,
          useValue: { evaluations: evaluations.value, ...evaluations },
        },
        {
          provide: LatestFixturesStore,
          useValue: { latestFixtures: latestFixtures.value, ...latestFixtures },
        },
        { provide: AnalysesStore, useValue: { analyses: signal(null) } },
        { provide: EventsStore, useValue: { events: signal(null) } },
        { provide: StatisticsStore, useValue: { statistics: signal(null) } },
        {
          provide: TeamCoachesStore,
          useValue: {
            teamCoaches: signal(null),
            isLoading: signal(false),
            error: signal(null),
          },
        },
      ],
    });
  };

  beforeEach(() => {
    fixtureState.set(null);
    isFixtureLoading.set(false);
    standings = createResourceState();
    evaluations = createResourceState();
    latestFixtures = createResourceState();
    configureTestingModule();
    facade = TestBed.inject(MatchDetailsFacade);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('keeps available section data visible during refresh but hides sections while fixture details load', () => {
    standings.isLoading.set(true);
    evaluations.isLoading.set(true);
    latestFixtures.isLoading.set(true);

    expect([
      facade.standingsLoading(),
      facade.evaluationsLoading(),
      facade.latestFixturesLoading(),
    ]).toEqual([true, true, true]);

    standings.value.set({});
    evaluations.value.set({});
    latestFixtures.value.set({});

    expect([
      facade.standingsLoading(),
      facade.evaluationsLoading(),
      facade.latestFixturesLoading(),
    ]).toEqual([false, false, false]);

    isFixtureLoading.set(true);

    expect([
      facade.detailsLoading(),
      facade.standingsLoading(),
      facade.evaluationsLoading(),
      facade.latestFixturesLoading(),
    ]).toEqual([true, true, true, true]);

    isFixtureLoading.set(false);

    expect(facade.detailsLoading()).toBe(false);

    standings.error.set('failure');

    expect(facade.standingsError()).toBe('failure');
  });

  it('derives competition and round restrictions when fixture data changes', () => {
    expect(facade.isKoPhase()).toBe(false);

    fixtureState.set({ data: EXAMPLE_FIXTURE, highlights: [] });

    expect(facade.isKoPhase()).toBe(true);

    fixtureState.set({
      data: {
        ...EXAMPLE_FIXTURE,
        league: {
          ...EXAMPLE_FIXTURE.league,
          id: 78,
          round: 'Regular Season - 3',
        },
      },
      highlights: [],
    });

    expect(facade.isKoPhase()).toBe(false);
    expect(facade.isQualifyPhase()).toBe(false);
    expect(facade.hasMultipleGroups()).toBe(false);
    expect(facade.hasNoStandings()).toBe(false);

    fixtureState.set(null);

    expect(facade.hasNoStandings()).toBe(false);
  });
});
