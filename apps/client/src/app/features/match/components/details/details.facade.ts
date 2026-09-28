import { computed, effect, inject, Injectable, signal } from '@angular/core';

import {
  isCompetitionWithMultipleGroups,
  isCompetitionWithoutStandings,
  isKoPhase,
  isQualifyPhase,
} from '@lib/shared';

import { environment } from '../../../../../environments/environment';

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
  private readonly standingsStore = inject(FixtureStandingsStore);
  public readonly standings = this.standingsStore.standings;
  public readonly standingsError = this.standingsStore.error;

  private readonly analysesStore = inject(AnalysesStore);
  public readonly analyses = this.analysesStore.analyses;

  private readonly latestFixturesStore = inject(LatestFixturesStore);
  public readonly latestFixtures = this.latestFixturesStore.latestFixtures;
  public readonly latestFixturesError = this.latestFixturesStore.error;

  private readonly eventsStore = inject(EventsStore);
  public readonly events = this.eventsStore.events;

  private readonly statisticsStore = inject(StatisticsStore);
  public readonly statistics = this.statisticsStore.statistics;

  private readonly evaluationsStore = inject(EvaluationsStore);
  public readonly evaluations = this.evaluationsStore.evaluations;
  public readonly evaluationsError = this.evaluationsStore.error;

  private readonly fixtureStore = inject(FixtureStore);
  public readonly fixture = this.fixtureStore.fixture;

  private readonly preview = signal<boolean>(
    !environment.production && environment.matchSkeletonPreviewMs > 0
  );

  public readonly detailsLoading = computed<boolean>(
    () => this.preview() || this.fixtureStore.isLoading()
  );
  public readonly standingsLoading = computed<boolean>(
    () =>
      this.detailsLoading() ||
      (this.standingsStore.isLoading() && !this.standings())
  );
  public readonly evaluationsLoading = computed<boolean>(
    () =>
      this.detailsLoading() ||
      (this.evaluationsStore.isLoading() && !this.evaluations())
  );
  public readonly latestFixturesLoading = computed<boolean>(
    () =>
      this.detailsLoading() ||
      (this.latestFixturesStore.isLoading() && !this.latestFixtures())
  );

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

  private readonly previewEffect = effect((onCleanup): void => {
    const loading = this.fixtureStore.isLoading();
    if (environment.production || environment.matchSkeletonPreviewMs <= 0)
      return;
    this.preview.set(true);
    if (loading) return;
    const timer = setTimeout(
      () => this.preview.set(false),
      environment.matchSkeletonPreviewMs
    );
    onCleanup(() => clearTimeout(timer));
  });
}
