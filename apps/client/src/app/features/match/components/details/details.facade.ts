import { computed, inject, Injectable } from '@angular/core';

import {
  isCompetitionWithMultipleGroups,
  isCompetitionWithoutStandings,
  isKoPhase,
  isQualifyPhase,
} from '@reelscore-sdk/helpers';

import {
  AnalysesStore,
  EvaluationsStore,
  EventsStore,
  FixtureLineupsStore,
  FixtureStandingsStore,
  FixtureStore,
  HeadToHeadFixturesStore,
  LatestFixturesStore,
  StatisticsStore,
  TeamCoachesStore,
} from '../../state';

@Injectable()
export class MatchDetailsFacade {
  private readonly standingsStore = inject(FixtureStandingsStore);
  private readonly analysesStore = inject(AnalysesStore);
  private readonly latestFixturesStore = inject(LatestFixturesStore);
  private readonly headToHeadFixturesStore = inject(HeadToHeadFixturesStore);
  private readonly eventsStore = inject(EventsStore);
  private readonly statisticsStore = inject(StatisticsStore);
  private readonly lineupsStore = inject(FixtureLineupsStore);
  private readonly teamCoachesStore = inject(TeamCoachesStore);
  private readonly evaluationsStore = inject(EvaluationsStore);
  private readonly fixtureStore = inject(FixtureStore);

  public readonly fixture = this.fixtureStore.fixture;
  public readonly detailsLoading = this.fixtureStore.isLoading;

  public readonly standings = this.standingsStore.standings;
  public readonly standingsLoading = computed<boolean>(
    () =>
      this.detailsLoading() ||
      (this.standingsStore.isLoading() && !this.standings())
  );
  public readonly standingsError = this.standingsStore.error;

  public readonly teamCoaches = computed(
    () => this.teamCoachesStore.teamCoaches()?.data ?? []
  );
  public readonly teamCoachesLoading = this.teamCoachesStore.isLoading;
  public readonly teamCoachesError = this.teamCoachesStore.error;

  public readonly latestFixtures = this.latestFixturesStore.latestFixtures;
  public readonly latestFixturesLoading = computed<boolean>(
    () => this.detailsLoading() || this.latestFixturesStore.isLoading()
  );
  public readonly latestFixturesError = this.latestFixturesStore.error;

  public readonly headToHeadFixtures =
    this.headToHeadFixturesStore.headToHeadFixtures;
  public readonly headToHeadFixturesLoading = computed<boolean>(
    () => this.detailsLoading() || this.headToHeadFixturesStore.isLoading()
  );
  public readonly headToHeadFixturesError = this.headToHeadFixturesStore.error;

  public readonly evaluations = this.evaluationsStore.evaluations;
  public readonly evaluationsLoading = computed<boolean>(
    () =>
      this.detailsLoading() ||
      (this.evaluationsStore.isLoading() && !this.evaluations())
  );
  public readonly evaluationsError = this.evaluationsStore.error;

  public readonly analyses = this.analysesStore.analyses;
  public readonly analysesLoading = computed<boolean>(
    () => this.detailsLoading() || this.analysesStore.isLoading()
  );
  public readonly analysesError = this.analysesStore.error;

  public readonly lineups = computed(() => {
    const data = this.lineupsStore.data();

    return data?.lineups.length ? data : null;
  });

  public readonly events = this.eventsStore.events;
  public readonly eventsLoading = computed<boolean>(
    () => this.detailsLoading() || this.eventsStore.isLoading()
  );
  public readonly eventsError = this.eventsStore.error;

  public readonly statistics = this.statisticsStore.statistics;
  public readonly statisticsLoading = computed<boolean>(
    () => this.detailsLoading() || this.statisticsStore.isLoading()
  );
  public readonly statisticsError = this.statisticsStore.error;

  public readonly hasNoStandings = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture
      ? isCompetitionWithoutStandings(fixture.data.league.id)
      : false;
  });
  public readonly isKoPhase = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture ? isKoPhase(fixture.data.league.round) : false;
  });
  public readonly isQualifyPhase = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture ? isQualifyPhase(fixture.data.league.round) : false;
  });
  public readonly hasMultipleGroups = computed<boolean>(() => {
    const fixture = this.fixture();
    return fixture
      ? isCompetitionWithMultipleGroups(
          fixture.data.league.id,
          fixture.data.league.season
        )
      : false;
  });
}
