import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EvaluationAnalyses } from '@lib/models';

@Component({
  selector: 'rs-match-fixture-analyses-evaluation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col gap-1 text-left; }
    :host-context(.is-away) .analyze-element { @apply flex-row-reverse; }
    .analyze-element { 
      @apply flex flex-wrap gap-1;

      &:not(.is-lucky):not(.is-unlucky) div { @apply bg-gray-100 text-rs-color-text-1; }
      &.is-lucky div { @apply bg-[#0db500] text-rs-color-text-3; }
      &.is-unlucky div { @apply bg-[#ff0000] text-rs-color-text-3; }
      div { @apply text-rs-font-size-small p-2 leading-[1]; }
    }
  `,
  template: `
    <div
      class="analyze-element"
      [class.is-lucky]="analyzedElement().level === 'LUCKY'"
      [class.is-unlucky]="analyzedElement().level === 'UNLUCKY'"
    >
      @if (analyzedElement().minute !== null) {
      <div class="minute">
        {{ analyzedElement().minute + "'" }}
      </div>
      } @if (analyzedElement().level !== null) {
      <div class="level">
        @switch (analyzedElement().level) { @case('LUCKY') { Glück gehabt }
        @case('UNLUCKY') { Pech gehabt } }
      </div>
      } @if (analyzedElement().type !== null) {
      <div class="type">
        @switch(analyzedElement().type) { @case('GOAL') { TOR } @case('NO_GOAL')
        { KEIN TOR } @case('NO_FOUL') { KEIN FOUL } @case('LAST_MINUTE_GOAL') {
        LAST-MINUTE TOR } @case('PENALTY') { ELFMETER } @case('RED_CARD') { ROTE
        KARTE } @case('NO_RED_CARD') { KEINE ROTE KARTE }
        @case('KEY_PLAYER_INJURY') { STAMMSPIELER VERLETZT }
        @case('KEY_PLAYER_YELLOW_CARD_SUSPENSION') { STAMMSPIELER NÄCHSTES SPIEL
        GESPERRT } }
      </div>
      } @if (analyzedElement().comments !== null) {
      <div class="comments">
        {{ analyzedElement().comments }}
      </div>
      } @if (analyzedElement().player !== null) {
      <div class="player">
        {{ analyzedElement().player }}
      </div>
      }
    </div>
  `,
})
export class AnalysesEvaluationComponent {
  analyzedElement = input.required<EvaluationAnalyses>();
}
