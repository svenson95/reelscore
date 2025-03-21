import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  ExtendedFixtureDTO,
  FixtureEvaluations,
  FixtureTeam,
} from '@lib/models';

import { AnalysesEvaluationComponent } from './components';
import { ExtendedEvaluationAnalyses, FixtureWithEvaluations } from './models';

@Component({
  selector: 'reelscore-match-fixture-analyses-evaluations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnalysesEvaluationComponent, DatePipe],
  styles: `
    :host { @apply flex flex-col gap-6; }
    .fixture:not(:last-of-type) { @apply border-b pb-5; }
    .date { @apply mb-2 text-center text-fb-font-size-body-2 bg-fb-color-white-2; }
    .fixture-header { @apply flex gap-2 border-b; }
    .home-name, .away-name { 
      @apply flex-1 text-center pb-2; 

      &.is-winner { @apply decoration-green-500; }
      &.is-loser { @apply decoration-red-500; }
    }
    .evaluations { @apply flex flex-col; }
    .evaluation { @apply flex gap-2; }
    .evaluation:not(:last-of-type) { @apply border-b; }
    .home-col { @apply border-r pr-2; }
    .home-col, .away-col { @apply min-w-[150px] sm:min-w-[200px] flex-1 py-2; }
  `,
  template: `
    @for (fixture of fixturesWithEvaluations(); track $index) {
    <div class="fixture">
      <div class="date">{{ fixture.fixture.date | date : 'dd.MM.yyyy' }}</div>
      <div class="fixture-header">
        <div class="home-name">
          {{ fixture.teams.home.name }}
        </div>
        <div class="result">
          {{ fixture.goals.home }}:{{ fixture.goals.away }}
        </div>
        <div class="away-name">
          {{ fixture.teams.away.name }}
        </div>
      </div>
      <div class="evaluations">
        @for (evaluation of fixture.flatEvaluations; track $index) {
        <div class="evaluation">
          <div class="home-col">
            @if (evaluation.team === 'home') {
            <reelscore-match-fixture-analyses-evaluation
              [analyzedElement]="evaluation"
            />
            }
          </div>
          <div class="away-col">
            @if (evaluation.team === 'away') {
            <reelscore-match-fixture-analyses-evaluation
              [analyzedElement]="evaluation"
            />
            }
          </div>
        </div>
        }
      </div>
    </div>
    }
  `,
})
export class AnalysesEvaluationsComponent {
  fixtures = input.required<ExtendedFixtureDTO[] | undefined>();
  relatedTeam = input.required<FixtureTeam>();

  fixturesWithEvaluations = computed<FixtureWithEvaluations[]>(() => {
    const fixtures = this.fixtures() || [];

    const fixturesWithAnalyses = (f: ExtendedFixtureDTO): boolean => {
      const home = f.evaluations?.home.analyses;
      const away = f.evaluations?.away.analyses;
      if (!home || !away) return false;
      return home.length > 0 || away.length > 0;
    };
    const fixturesWithFlatEvaluations = (
      f: ExtendedFixtureDTO
    ): FixtureWithEvaluations => ({
      ...f,
      flatEvaluations: f.evaluations
        ? this.analysesWithTeam(f.evaluations)
        : [],
    });

    return fixtures
      .filter(fixturesWithAnalyses)
      .map(fixturesWithFlatEvaluations);
  });

  private analysesWithTeam = (
    evaluations: FixtureEvaluations
  ): ExtendedEvaluationAnalyses[] => {
    const home: ExtendedEvaluationAnalyses[] = evaluations?.home.analyses.map(
      (a) => ({
        ...a,
        team: 'home',
      })
    );
    const away: ExtendedEvaluationAnalyses[] = evaluations?.away.analyses.map(
      (a) => ({
        ...a,
        team: 'away',
      })
    );
    return [...home, ...away].sort((a, b) => {
      if (a.minute === null || b.minute === null) return 0;
      return a.minute - b.minute;
    });
  };
}
