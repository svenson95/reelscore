import { computed, inject, Injectable } from '@angular/core';

import {
  isCompetitionWithMultipleGroups,
  isCompetitionWithoutStandings,
  isKoPhase,
  isQualifyPhase,
} from '@lib/shared';

import {
  AnalysesStore,
  EvaluationsStore,
  EventsStore,
  FixtureStandingsStore,
  FixtureStore,
  LatestFixturesStore,
  StatisticsStore,
} from '../../store';

@Injectable()
export class MatchDetailsFacade {
  standingsStore = inject(FixtureStandingsStore);
  standings = this.standingsStore.standings;

  analysesStore = inject(AnalysesStore);
  analyses = this.analysesStore.analyses;

  latestFixturesStore = inject(LatestFixturesStore);
  latestFixtures = this.latestFixturesStore.latestFixtures;

  eventsStore = inject(EventsStore);
  events = this.eventsStore.events;

  statisticsStore = inject(StatisticsStore);
  statistics = this.statisticsStore.statistics;

  evaluationsStore = inject(EvaluationsStore);
  evaluations = this.evaluationsStore.evaluations;

  fixtureStore = inject(FixtureStore);
  fixture = this.fixtureStore.fixture;

  hasNoStandings = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture
      ? isCompetitionWithoutStandings(fixture.data.league.id)
      : false;
  });

  isKoPhase = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture ? isKoPhase(fixture.data.league.round) : false;
  });

  isQualifyPhase = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture ? isQualifyPhase(fixture.data.league.round) : false;
  });

  hasMultipleGroups = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture
      ? isCompetitionWithMultipleGroups(
          fixture.data.league.id,
          fixture.data.league.season
        )
      : false;
  });
}
