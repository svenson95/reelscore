import { computed, inject, Injectable } from '@angular/core';

import {
  isCompetitionWithMultipleGroups,
  isCompetitionWithoutStandings,
  isKoPhase,
} from '@lib/shared';

import { BreakpointObserverService } from '../../../../shared';
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
  breakpointObserverService = inject(BreakpointObserverService);
  isMobile = this.breakpointObserverService.isMobile;

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

  // TODO update template to display multiple rounds for group (e. g. 2025-03-23 uefa nations league had multiple rounds on same day)
  hasMultipleGroups = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture
      ? isCompetitionWithMultipleGroups(fixture.data.league.id)
      : false;
  });
}
