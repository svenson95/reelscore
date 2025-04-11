import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import {
  ExtendedFixtureDTO,
  FixtureEvaluations,
  FixtureTeam,
} from '@lib/models';

import {
  TeamIsRelatedPipe,
  TeamNamePipe,
} from '../../../../../../../../../../../shared';

import { AnalysesEvaluationComponent } from './components';
import { ExtendedEvaluationAnalyses, FixtureWithEvaluations } from './models';

const ANGULAR_MODULES = [DatePipe, MatExpansionModule];

@Component({
  selector: 'rs-match-fixture-analyses-evaluations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...ANGULAR_MODULES,
    AnalysesEvaluationComponent,
    TeamIsRelatedPipe,
    TeamNamePipe,
  ],
  styles: `
    @use '@angular/material' as mat;

    :host { 
      @apply flex flex-col; 

      ::ng-deep {
        .mat-expansion-panel:not([class*=mat-elevation-z]) { box-shadow: none; }
        .mat-expansion-panel-header { @apply px-3 sm:px-[initial]; }
        .mat-expansion-panel-header-title { @apply flex-grow-0; }
      }
    }

    mat-expansion-panel {
      @include mat.expansion-overrides((
        container-background-color: var(--rs-color-white),
        header-text-size: var(--rs-font-size-body-2),
      ));
    }

    .fixture-header { @apply flex gap-2; }
    .home-name, .away-name { 
      @apply flex-1 text-center leading-none content-center; 

      &.is-winner { @apply underline decoration-green-500; }
      &.is-loser { @apply underline decoration-red-500; }
      &.is-related { @apply font-semibold; }
    }
    .evaluations { @apply flex flex-col; }
    .evaluation { @apply flex gap-2; }
    .evaluation:not(:last-of-type) { @apply border-b; }
    .home-col { @apply border-r pr-2; }
    .home-col, .away-col { @apply min-w-[120px] sm:min-w-[200px] flex-1 py-2; }
  `,
  template: `
    @for (fixture of fixturesWithEvaluations(); track $index) {
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{ fixture.fixture.date | date : 'dd.MM' }}
        </mat-panel-title>
        <mat-panel-description>
          <div class="fixture-header">
            <div
              class="home-name"
              [class.is-winner]="
                fixture.teams.home.winner === true &&
                (fixture.teams.home | isRelated : relatedTeam())
              "
              [class.is-loser]="
                fixture.teams.home.winner === false &&
                (fixture.teams.home | isRelated : relatedTeam())
              "
              [class.is-related]="
                fixture.teams.home | isRelated : relatedTeam()
              "
            >
              {{ fixture.teams.home.name | teamName : 'short' }}
            </div>
            <div class="result">
              {{ fixture.goals.home }}:{{ fixture.goals.away }}
            </div>
            <div
              class="away-name"
              [class.is-winner]="
                fixture.teams.away.winner === true &&
                (fixture.teams.away | isRelated : relatedTeam())
              "
              [class.is-loser]="
                fixture.teams.away.winner === false &&
                (fixture.teams.away | isRelated : relatedTeam())
              "
              [class.is-related]="
                fixture.teams.away | isRelated : relatedTeam()
              "
            >
              {{ fixture.teams.away.name | teamName : 'short' }}
            </div>
          </div>
        </mat-panel-description>
      </mat-expansion-panel-header>

      <div class="evaluations">
        @for (evaluation of fixture.flatEvaluations; track $index) {
        <div class="evaluation">
          <div class="home-col">
            @if (evaluation.team === 'home') {
            <rs-match-fixture-analyses-evaluation
              [analyzedElement]="evaluation"
            />
            }
          </div>
          <div class="away-col">
            @if (evaluation.team === 'away') {
            <rs-match-fixture-analyses-evaluation
              [analyzedElement]="evaluation"
            />
            }
          </div>
        </div>
        }
      </div>
    </mat-expansion-panel>
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
