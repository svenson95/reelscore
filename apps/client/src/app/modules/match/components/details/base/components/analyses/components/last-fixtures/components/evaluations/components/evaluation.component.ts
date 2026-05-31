import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EvaluationAnalyses } from '@lib/models';

@Component({
  selector: 'rs-match-fixture-analyses-evaluation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col gap-1 text-left; }
    :host-context(.is-related-team) .analyze-element { @apply opacity-100; }
    :host-context(.is-away) .analyze-element { @apply flex-row-reverse; }
    .analyze-element {
      @apply flex flex-wrap gap-1 opacity-50;

      &:not(.is-lucky):not(.is-unlucky) .comments { @apply bg-rs-border-color-1; }
      &.is-lucky .level { @apply bg-[#0db500] text-white; }
      &.is-unlucky .level { @apply bg-[#ff0000] text-white; }
      div { @apply font-medium text-rs-color-text-1 text-rs-font-size-small p-2 leading-[1]; }
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
      } @if (analyzedElement().type !== null) {
      <div class="type">
        @switch(analyzedElement().type) { @case('GOAL') { ⚽ } @case('NO_GOAL')
        { KEIN TOR } @case('NO_FOUL') { KEIN FOUL } @case('LAST_MINUTE_GOAL') {
        LAST-MINUTE ⚽ } @case('PENALTY') { ELFMETER ⚽ } @case('RED_CARD') { 🟥
        KARTE } @case('NO_RED_CARD') { KEINE 🟥 KARTE }
        @case('KEY_PLAYER_INJURY') { STAMMSPIELER VERLETZT }
        @case('KEY_PLAYER_YELLOW_CARD_SUSPENSION') { STAMMSPIELER NÄCHSTES SPIEL
        🟨 GESPERRT } }
      </div>
      } @if (analyzedElement().level !== null) {
      <div class="level">
        @switch (analyzedElement().level) { @case('LUCKY') { Glück }
        @case('UNLUCKY') { Pech } }
      </div>
      } @if (analyzedElement().comments !== null && analyzedElement().comments
      !== '') {
      <div class="comments">
        {{ analyzedElement().comments }}
      </div>
      } @if (analyzedElement().player !== null && analyzedElement().player !==
      '') {
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
