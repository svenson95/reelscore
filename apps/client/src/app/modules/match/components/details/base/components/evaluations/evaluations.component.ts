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
      @apply flex flex-col gap-10 w-fit py-4 my-5 mx-auto; 

      border-width: 1px;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);
    }
    .content > .teams-form { 
      @apply flex flex-col gap-5 mx-auto;

      .header { @apply w-full flex justify-between m-auto; }
      .form-hints { @apply flex gap-3 items-center text-rs-color-text-2; }
      .form-title { @apply text-rs-font-size-body-2 xs:text-rs-font-size-body-1 text-rs-color-text-3; }
    }

    .form-hints, .today { @apply text-rs-font-size-small xs:text-rs-font-size-body-2; }

    .evaluation {
      @apply flex gap-5 text-rs-font-size-small xs:text-rs-font-size-body-2;

      .team { 
        @apply flex flex-1 gap-1 xs:gap-2; 

        &:first-of-type { @apply justify-end; }
      }

      .today { @apply self-center text-rs-color-text-3; }

      span, .evaluation-placeholder {
        @apply w-[19px] h-[19px] xs:w-[24px] xs:h-[24px] flex items-center justify-center leading-[19px] xs:leading-[24px];
      }
      .evaluation-placeholder { @apply bg-gray-200; }

      span {
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
      @let teams = evaluations()?.teams;

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
            @if (!teams) { @for (item of PLACEHOLDER_ITEMS; track $index) {
            <span class="evaluation-placeholder"></span>
            } }@else { @for (result of teams.home.results.reverse(); track
            $index + '-' + result) {
            <span [class]="result | rsToKebabCase">
              @switch(result) { @case ("LOSS") {N} @case ("DRAW") {U} @case
              ("WIN") {S} @case("NO_RESULT_AVAILABLE") {-} }
            </span>
            } }
          </div>

          <div class="today">Heute</div>

          <div class="team">
            @if (!teams) { @for (item of PLACEHOLDER_ITEMS; track $index) {
            <span class="evaluation-placeholder"></span>
            } } @else { @for (result of teams.away.results; track $index + '-' +
            result) {
            <span [class]="result | rsToKebabCase">
              @switch(result) { @case ("LOSS") {N} @case ("DRAW") {U} @case
              ("WIN") {S} @case("NO_RESULT_AVAILABLE") {-} }
            </span>
            } }
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
            @if (!teams) { @for (item of PLACEHOLDER_ITEMS; track $index) {
            <span class="evaluation-placeholder"></span>
            } } @else { @for (performance of teams.home.performances.reverse();
            track $index + '-' +performance) {
            <span [class]="performance | rsToKebabCase">
              @switch(performance) { @case ("LOW") {S} @case ("MIDDLE") {M}
              @case ("HIGH") {G} @case("MATCH_NOT_STARTED") {?}
              @case("MATCH_POSTPONED") {-} @case("NO_STATISTICS_AVAILABLE") {-}
              }
            </span>
            } }
          </div>

          <div class="today">Heute</div>

          <div class="team">
            @if (!teams) { @for (item of PLACEHOLDER_ITEMS; track $index) {
            <span class="evaluation-placeholder"></span>
            } } @else { @for (performance of teams.away.performances; track
            $index + '-' + performance) {
            <span [class]="performance | rsToKebabCase">
              @switch(performance) { @case ("LOW") {S} @case ("MIDDLE") {M}
              @case ("HIGH") {G} @case("MATCH_NOT_STARTED") {?}
              @case("MATCH_POSTPONED") {-} @case("NO_STATISTICS_AVAILABLE") {-}
              }
            </span>
            } }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MatchEvaluationsComponent {
  readonly PLACEHOLDER_ITEMS = [0, 1, 2, 3, 4];
  evaluations = input.required<EvaluationDTO | null>();
}
