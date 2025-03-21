import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EvaluationAnalyses } from '@lib/models';

@Component({
  selector: 'reelscore-match-fixture-analyses-evaluation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col gap-1 text-left; }
    .analyze-element { 
      @apply flex flex-wrap gap-1;
      :host-context(.home-col) & { @apply flex-row-reverse; }

      &.is-lucky div { @apply bg-green-100 text-green-500; }
      &:not(.is-lucky) div { @apply bg-red-100 text-red-500; }
      div { @apply text-fb-font-size-small px-2 py-1; }
    }
  `,
  template: `
    <div
      class="analyze-element"
      [class.is-lucky]="analyzedElement().level === 'LUCKY'"
    >
      @if (analyzedElement().minute !== null) {
      <div class="minute">
        {{ analyzedElement().minute + "'" }}
      </div>
      }
      <div class="level">{{ analyzedElement().level }}</div>
      <div class="type">
        @switch(analyzedElement().type) { @case('GOAL') { TOR } @case('NO_GOAL')
        { KEIN TOR } @case('LAST_MINUTE_GOAL') { LAST-MINUTE TOR }
        @case('PENALTY') { ELFMETER } @case('RED_CARD') { ROTE KARTE }
        @case('NO_RED_CARD') { KEINE ROTE KARTE } @case('KEY_PLAYER_INJURY') {
        STAMMSPIELER VERLETZT } @case('KEY_PLAYER_YELLOW_CARD_SUSPENSION') {
        STAMMSPIELER NÄCHSTES SPIEL GESPERRT } }
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
