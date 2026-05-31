import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  ExtendedFixtureDTO,
  FixtureEvaluation,
  FixtureEvaluations,
  LatestFixturesDTO,
  MatchTeams,
} from '@lib/models';

import { AnalysesEvaluationsComponent } from './components';
import {
  ANALYSES_TEAM,
  AnalysesTeamType,
  ExtendedEvaluationAnalyses,
  FixtureWithEvaluations,
} from './models';

@Component({
  selector: 'rs-match-fixture-analyses-last-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnalysesEvaluationsComponent],
  styles: `
    .latest-fixtures { @apply flex flex-wrap gap-3 my-5; }
    .latest-fixtures div {
      @apply flex-1 min-[400px]:min-w-[400px] max-w-full min-[860px]:max-w-[calc(50%-10px)];
    }
  `,
  template: `
    <h2>Spielanalysen</h2>

    <div class="latest-fixtures">
      @let f = fixturesWithEvaluations(); @let homeFixtures = f.home; @let
      awayFixtures = f.away; @let t = teams(); @if (homeFixtures.length > 0) {
      <div class="home">
        <rs-match-fixture-analyses-evaluations
          [fixtures]="homeFixtures"
          [relatedTeam]="t.home"
        />
      </div>
      } @if (awayFixtures.length > 0) {
      <div class="away">
        <rs-match-fixture-analyses-evaluations
          [fixtures]="awayFixtures"
          [relatedTeam]="t.away"
        />
      </div>
      }
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
