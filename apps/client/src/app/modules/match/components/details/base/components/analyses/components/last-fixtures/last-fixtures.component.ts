import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import type {
  ExtendedFixtureDTO,
  FixtureEvaluation,
  FixtureEvaluations,
  LatestFixturesDTO,
  MatchTeams,
} from '@lib/models';

import { AnalysesEvaluationsComponent } from './components';
import {
  ANALYSES_TEAM,
  type AnalysesTeamType,
  type ExtendedEvaluationAnalyses,
  type FixtureWithEvaluations,
} from './models';

@Component({
  selector: 'rs-match-fixture-analyses-last-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnalysesEvaluationsComponent],
  styles: `
    :host { @apply m-3; }
    .latest-fixtures { @apply grid grid-cols-1 md:grid-cols-2 gap-3 mt-rs1; }
    .latest-fixtures > div { @apply min-w-0; }
    .no-data { @apply bg-rs-button-bg rounded-fb shadow-rs3; }
  `,
  template: `
    <h2>Spielanalysen</h2>

    <div class="latest-fixtures">
      @let fixturesData = fixturesWithEvaluations(); @let teamsData = teams();
      <div class="home">
        @if (fixturesData.home.length > 0) {
        <rs-match-fixture-analyses-evaluations
          [fixtures]="fixturesData.home"
          [relatedTeam]="teamsData.home"
        />
        } @else {
        <p class="no-data">Keine Spiele gefunden</p>
        }
      </div>
      <div class="away">
        @if (fixturesData.away.length > 0) {
        <rs-match-fixture-analyses-evaluations
          [fixtures]="fixturesData.away"
          [relatedTeam]="teamsData.away"
        />
        } @else {
        <p class="no-data">Keine Spiele gefunden</p>
        }
      </div>
    </div>
  `,
})
export class AnalysesLastFixturesComponent {
  readonly fixtures = input.required<LatestFixturesDTO>();
  readonly teams = input.required<MatchTeams>();

  readonly fixturesWithEvaluations = computed<{
    home: FixtureWithEvaluations[];
    away: FixtureWithEvaluations[];
  }>(() => ({
    home: this.toFixturesWithEvaluations(this.fixtures().home),
    away: this.toFixturesWithEvaluations(this.fixtures().away),
  }));

  private toFixturesWithEvaluations = (
    fixtures: ExtendedFixtureDTO[]
  ): FixtureWithEvaluations[] => {
    return fixtures.filter(this.hasAnalyses).map((fixture) => ({
      ...fixture,
      flatEvaluations: fixture.evaluations
        ? this.analysesWithTeam(fixture.evaluations)
        : [],
    }));
  };

  private hasAnalyses = (fixture: ExtendedFixtureDTO): boolean => {
    const home = fixture.evaluations?.home.analyses;
    const away = fixture.evaluations?.away.analyses;
    return !!home?.length || !!away?.length;
  };

  private analysesWithTeam = (
    evaluations: FixtureEvaluations
  ): ExtendedEvaluationAnalyses[] => {
    const home = this.mapTeamAnalyses(evaluations.home, ANALYSES_TEAM.HOME);
    const away = this.mapTeamAnalyses(evaluations.away, ANALYSES_TEAM.AWAY);

    return [...home, ...away].sort((a, b) => {
      if (a.minute === null || b.minute === null) return 0;
      return a.minute - b.minute;
    });
  };

  private mapTeamAnalyses = (
    data: FixtureEvaluation,
    team: AnalysesTeamType
  ) => {
    return data.analyses.map((analysis) => ({
      ...analysis,
      team,
    }));
  };
}
