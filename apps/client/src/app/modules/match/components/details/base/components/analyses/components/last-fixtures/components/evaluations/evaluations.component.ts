import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  untracked,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { TeamIsRelatedPipe, TeamNamePipe } from '@app/shared';
import type { ExtendedFixtureDTO, FixtureTeam } from '@lib/models';
import type { AnalysesTeamType, FixtureWithEvaluations } from '../../models';
import { ANALYSES_TEAM } from '../../models';

import { AnalysesEvaluationComponent } from './components';

const EXTERNAL_MODULES = [DatePipe, MatExpansionModule];

@Component({
  selector: 'rs-match-fixture-analyses-evaluations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...EXTERNAL_MODULES,
    AnalysesEvaluationComponent,
    TeamIsRelatedPipe,
    TeamNamePipe,
  ],
  styles: `
    @use '@angular/material' as mat;

    :host {
      @apply flex flex-col;

      mat-expansion-panel {
        @apply mb-px shadow-rs3;

        ::ng-deep {
          .mat-expansion-panel-header-title { @apply flex-grow-0 text-rs-font-size-small; }
          .mat-expansion-panel-header { @apply px-rs2; }
        }

        @include mat.expansion-overrides((
          container-background-color: var(--rs-color-text-3),
          container-shape: var(--rs-size-border-radius),
          header-text-size: var(--rs-font-size-body-2),
          header-text-weight: 400,
          header-text-color: var(--rs-color-text-1),
          header-description-color: var(--rs-color-text-1),
          header-indicator-color: var(--rs-color-primary)
        ));
      }
    }

    .fixture-header { @apply flex gap-2 w-full; }
    .fixture-header > div { @apply leading-none;}
    .home-name { @apply text-right; }
    .home-name, .away-name {
      @apply flex-1 content-center;

      &.is-winner { @apply underline decoration-rs-color-green; }
      &.is-loser { @apply underline decoration-rs-color-red; }
      &.is-related { @apply font-semibold; }
    }
    .evaluations { @apply flex flex-col pt-4; }
    .evaluation { @apply flex gap-2; }
    .evaluation.is-away {
      @apply flex-row-reverse;
    }
    .evaluation:not(:last-of-type) { @apply border-b border-rs-button-border pb-2 mb-2; }
    .home-col { @apply border-r pr-2; }
    .home-col, .away-col { @apply min-w-[120px] sm:min-w-[200px] flex-1 py-2; }
  `,
  template: `
    <mat-accordion>
      @for (fixture of fixtures(); track $index) {
      <mat-expansion-panel>
        <mat-expansion-panel-header class="fixture-expansion-header">
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
          <rs-match-fixture-analyses-evaluation
            class="evaluation"
            [analyzedElement]="evaluation"
            [class.is-away]="evaluation.team === ANALYSES_TEAM.AWAY"
            [class.is-related-team]="isRelatedTeam()(fixture, evaluation.team)"
          />
          }
        </div>
      </mat-expansion-panel>
      }
    </mat-accordion>
  `,
})
export class AnalysesEvaluationsComponent {
  readonly ANALYSES_TEAM = ANALYSES_TEAM;

  readonly fixtures = input.required<FixtureWithEvaluations[]>();
  readonly relatedTeam = input.required<FixtureTeam>();

  readonly isRelatedTeam = computed(
    () => (fixture: ExtendedFixtureDTO, team: AnalysesTeamType) =>
      fixture.teams[team].id === untracked(this.relatedTeam).id
  );
}
