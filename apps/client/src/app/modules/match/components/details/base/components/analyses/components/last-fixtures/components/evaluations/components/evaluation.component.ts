import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EvaluationAnalyses } from '@lib/models';

@Component({
  selector: 'rs-match-fixture-analyses-evaluation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col gap-1 text-left; }
    .analyze-element { 
      @apply flex flex-wrap gap-1;
      :host-context(.home-col) & { @apply flex-row-reverse; }

      &.is-lucky div { @apply bg-green-100 text-green-500; }
      &.is-unlucky div { @apply bg-red-100 text-red-500; }
      &:not(.is-lucky):not(.is-unlucky) div { @apply bg-gray-100 text-gray-500; }
      div { @apply text-rs-font-size-small px-2 py-1; }
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
      }
      <div class="type">
        @switch(analyzedElement().type) { @case('GOAL') { TOR } @case('NO_GOAL')
        { KEIN TOR } @case('NO_FOUL') { KEIN FOUL } @case('LAST_MINUTE_GOAL') {
        LAST-MINUTE TOR } @case('PENALTY') { ELFMETER } @case('RED_CARD') { ROTE
        KARTE } @case('NO_RED_CARD') { KEINE ROTE KARTE }
        @case('KEY_PLAYER_INJURY') { STAMMSPIELER VERLETZT }
        @case('KEY_PLAYER_YELLOW_CARD_SUSPENSION') { STAMMSPIELER NÄCHSTES SPIEL
        GESPERRT } }
      </div>
      @if (analyzedElement().player !== null) {
      <div class="player">
        {{ analyzedElement().player }}
      </div>
      } @if (analyzedElement().comments !== null) {
      <div class="comments">
        {{ analyzedElement().comments }}
      </div>
      }
    </div>
  `,
})
export class AnalysesEvaluationComponent {
  analyzedElement = input.required<EvaluationAnalyses>();
}
