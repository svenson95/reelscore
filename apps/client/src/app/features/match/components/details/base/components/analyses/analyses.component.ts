import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import type { MatchTeams } from '@lib/models';

import {
  AnalysesStore,
  FixtureStore,
  LatestFixturesStore,
} from '../../../../../store';

import {
  AnalysesLastFixturesComponent,
  AnalysesPredictionsComponent,
} from './components';

@Component({
  selector: 'rs-match-fixture-analyses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnalysesPredictionsComponent, AnalysesLastFixturesComponent],
  styles: `
    :host {
      @apply flex flex-col gap-rs2;
    }
  `,
  template: `
    @if (analyses(); as analysesData) {
    <rs-match-fixture-analyses-predictions [analyses]="analysesData" />
    } @if (teams(); as teamsData) { @if (latestFixtures(); as fixturesData) {
    <rs-match-fixture-analyses-last-fixtures
      [fixtures]="fixturesData"
      [teams]="teamsData"
    />
    } }
  `,
})
export class MatchFixtureAnalysesComponent {
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
