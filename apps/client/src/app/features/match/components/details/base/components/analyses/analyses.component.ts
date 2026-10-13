import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import type { MatchTeams } from '@reelscore-sdk/models';

import { PageTitleComponent } from '@app/shared';

import {
  AnalysesStore,
  FixtureStore,
  LatestFixturesStore,
} from '../../../../../state';

import {
  AnalysesLastFixturesComponent,
  AnalysesPredictionsComponent,
} from './components';

@Component({
  selector: 'rs-match-fixture-analyses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    AnalysesPredictionsComponent,
    AnalysesLastFixturesComponent,
  ],
  styles: `
    :host {
      @apply flex flex-col;
    }

    .analyses-skeleton {
      @apply mx-3 mb-3 mt-rs1 flex flex-col gap-rs2 rounded-border2 bg-rs-button-bg p-5 shadow-rs;
    }

    .analyses-skeleton-row {
      @apply flex min-h-12 items-center justify-between gap-4 border-b pb-rs1 last:border-b-0 last:pb-0;
    }

    .analyses-skeleton-value {
      @apply h-3 w-1/4;
    }

    .no-data {
      @apply mx-3 rounded-border2 bg-rs-button-bg p-rs2 text-center shadow-rs;
    }
  `,
  template: `
    <rs-page-title title="Analysen" />

    @if (isLoading()) {
    <div
      class="analyses-skeleton"
      aria-label="Analysen werden geladen"
      aria-busy="true"
    >
      @for (section of [0, 1, 2]; track section) {
      <div class="analyses-skeleton-row" aria-hidden="true">
        <span class="rs-skeleton analyses-skeleton-value"></span>
        <span class="rs-skeleton analyses-skeleton-value"></span>
        <span class="rs-skeleton analyses-skeleton-value"></span>
      </div>
      }
    </div>
    <rs-page-title title="Spielanalysen" />
    <div class="analyses-skeleton" aria-hidden="true" aria-busy="true">
      @for (side of [0, 1]; track side) { @for (row of [0, 1, 2, 3]; track row)
      {
      <div class="analyses-skeleton-row">
        <span class="rs-skeleton analyses-skeleton-value"></span>
        <span class="rs-skeleton analyses-skeleton-value"></span>
      </div>
      } }
    </div>
    } @else if (error() && !analyses() && !latestFixtures()) {
    <p class="no-data" role="status">Fehler beim Laden der Analysen</p>
    } @else { @if (analyses(); as analysesData) {
    <rs-match-fixture-analyses-predictions [analyses]="analysesData" />
    } @if (teams(); as teamsData) { @if (latestFixtures(); as fixturesData) {
    <rs-match-fixture-analyses-last-fixtures
      [fixtures]="fixturesData"
      [teams]="teamsData"
    />
    } } @if (!analyses() && !latestFixtures()) {
    <p class="no-data">Keine Analysen verfügbar</p>
    } }
  `,
})
export class MatchFixtureAnalysesComponent {
  readonly isLoading = input<boolean>(false);
  readonly error = input<unknown>(null);

  private readonly fixtureStore = inject(FixtureStore);
  private readonly latestFixturesStore = inject(LatestFixturesStore);
  private readonly analysesStore = inject(AnalysesStore);

  readonly analyses = this.analysesStore.analyses;
  readonly latestFixtures = this.latestFixturesStore.latestFixtures;

  readonly teams = computed<MatchTeams | null>(() => {
    const fixture = this.fixtureStore.fixture();

    if (!fixture) {
      return null;
    }

    return {
      home: fixture.data.teams.home,
      away: fixture.data.teams.away,
    };
  });
}
