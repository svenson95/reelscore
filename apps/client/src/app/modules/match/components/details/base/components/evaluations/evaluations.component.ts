import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EvaluationDTO } from '@lib/models';

import { EvaluationsStore } from '../../../../../store';

import { ToKebabCasePipe } from './pipes';

@Component({
  selector: 'rs-match-evaluations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToKebabCasePipe],
  providers: [EvaluationsStore],
  styles: `
    :host { @apply flex flex-col; }
    .content { 
      @apply w-fit bg-rs-color-white py-4 px-6 md:px-12 my-5 mx-auto; 

      border-width: 1px;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);
    }
    .content > .teams-form { 
      @apply flex flex-col gap-5 my-5 mx-auto;

      &:first-of-type { @apply border-b-[1px] pb-5; }
      .header { @apply w-full flex justify-between m-auto; }
      .form-hints { @apply flex gap-3 items-center text-rs-color-text-2; }
      .form-title { @apply text-rs-font-size-body-2 xs:text-rs-font-size-body-1; }
    }

    .form-hints, .today { @apply text-rs-font-size-small xs:text-rs-font-size-body-2; }

    .evaluation {
      @apply flex gap-5 text-rs-font-size-small xs:text-rs-font-size-body-2;

      .team { 
        @apply flex flex-1 gap-1 xs:gap-2; 

        &:first-of-type { @apply justify-end; }
      }

      .today { @apply self-center; }

      span {
        @apply w-[19px] h-[19px] xs:w-[24px] xs:h-[24px] flex items-center justify-center leading-[19px] xs:leading-[24px];

        &.loss, &.low { @apply bg-red-500 text-white; }
        &.draw, &.middle { @apply bg-gray-200; }
        &.win, &.high { @apply bg-green-500 text-white; }
        &.match-postponed, &.match-not-started, &.no-statistics-available, &.no-result-available { 
          @apply bg-gray-500 text-white font-bold; 
        }
      }
    }
  `,
  template: `
    <h3 class="match-section-title">FORM</h3>
    <div class="content">
      @let teams = evaluations()?.teams; @if (!teams) {
      <p class="no-data">Form wird geladen ...</p>
      } @else {
      <div class="teams-form results">
        <div class="header">
          <span class="form-title">Ergebnisse</span>
          <div class="form-hints">
            <span>Niederlage</span>
            <span>Unentschieden</span>
            <span>Sieg</span>
          </div>
        </div>
        <div class="evaluation">
          <div class="team">
            @for (result of teams.home.results.reverse(); track $index + '-' +
            result) {
            <span [class]="result | rsToKebabCase">
              @switch(result) { @case ("LOSS") {N} @case ("DRAW") {U} @case
              ("WIN") {S} @case("NO_RESULT_AVAILABLE") {-} }
            </span>
            }
          </div>

          <div class="today">Heute</div>

          <div class="team">
            @for (result of teams.away.results; track $index + '-' + result) {
            <span [class]="result | rsToKebabCase">
              @switch(result) { @case ("LOSS") {N} @case ("DRAW") {U} @case
              ("WIN") {S} @case("NO_RESULT_AVAILABLE") {-} }
            </span>
            }
          </div>
        </div>
      </div>

      <div class="teams-form performance">
        <div class="header">
          <span class="form-title">Performance</span>
          <div class="form-hints">
            <span>Schlecht</span>
            <span>Mittelmäßig</span>
            <span>Gut</span>
          </div>
        </div>
        <div class="evaluation">
          <div class="team">
            @for (performance of teams.home.performances.reverse(); track $index
            + '-' +performance) {
            <span [class]="performance | rsToKebabCase">
              @switch(performance) { @case ("LOW") {S} @case ("MIDDLE") {M}
              @case ("HIGH") {G} @case("MATCH_NOT_STARTED") {?}
              @case("MATCH_POSTPONED") {-} @case("NO_STATISTICS_AVAILABLE") {-}
              }
            </span>
            }
          </div>

          <div class="today">Heute</div>

          <div class="team">
            @for (performance of teams.away.performances; track $index + '-' +
            performance) {
            <span [class]="performance | rsToKebabCase">
              @switch(performance) { @case ("LOW") {S} @case ("MIDDLE") {M}
              @case ("HIGH") {G} @case("MATCH_NOT_STARTED") {?}
              @case("MATCH_POSTPONED") {-} @case("NO_STATISTICS_AVAILABLE") {-}
              }
            </span>
            }
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class MatchEvaluationsComponent {
  evaluations = input.required<EvaluationDTO | null>();
}
