import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { PageTitleComponent } from '@app/shared';
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
  imports: [PageTitleComponent, AnalysesEvaluationsComponent],
  styles: `
    .latest-fixtures {
      @apply grid grid-cols-1 md:grid-cols-2
        gap-3 mx-3 mb-3 mt-rs1;
    }

    .latest-fixtures > div {
      @apply min-w-0;
    }

    .no-data {
      @apply bg-rs-button-bg rounded-border2 shadow-rs3;
    }
  `,
  template: `
    <rs-page-title title="Spielanalysen" />

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

  private readonly toFixturesWithEvaluations = (
    fixtures: ExtendedFixtureDTO[]
  ): FixtureWithEvaluations[] => {
    return fixtures.filter(this.hasAnalyses).map((fixture) => ({
      ...fixture,
      flatEvaluations: fixture.evaluations
        ? this.analysesWithTeam(fixture.evaluations)
        : [],
    }));
  };

  private readonly hasAnalyses = (fixture: ExtendedFixtureDTO): boolean => {
    const home = fixture.evaluations?.home.analyses;
    const away = fixture.evaluations?.away.analyses;

    return !!home?.length || !!away?.length;
  };

  private readonly analysesWithTeam = (
    evaluations: FixtureEvaluations
  ): ExtendedEvaluationAnalyses[] => {
    const home = this.mapTeamAnalyses(evaluations.home, ANALYSES_TEAM.HOME);
    const away = this.mapTeamAnalyses(evaluations.away, ANALYSES_TEAM.AWAY);

    return [...home, ...away].sort((a, b) => {
      if (a.minute === null || b.minute === null) {
        return 0;
      }

      return a.minute - b.minute;
    });
  };

  private readonly mapTeamAnalyses = (
    data: FixtureEvaluation,
    team: AnalysesTeamType
  ): ExtendedEvaluationAnalyses[] => {
    return data.analyses.map((analysis) => ({
      ...analysis,
      team,
    }));
  };
}
