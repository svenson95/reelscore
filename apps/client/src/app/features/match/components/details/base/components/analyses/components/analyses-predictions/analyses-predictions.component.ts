import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { AnalysesDTO } from '@reelscore-sdk/models';

@Component({
  selector: 'rs-match-fixture-analyses-predictions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply flex flex-col;
    }

    .fixture-analyse {
      @apply mx-3 mb-3 mt-rs1 p-5
        bg-rs-button-bg rounded-border2 shadow-rs
        text-rs-color-text-1 text-rs-font-size-body-2;
    }

    .fixture-analyse > div {
      @apply w-full flex flex-wrap gap-5;

      &:not(:last-of-type) {
        @apply border-b-[1px] pb-5 border-rs-button-border;
      }

      &:not(:first-of-type) {
        @apply pt-5;
      }

      .home {
        @apply text-end;
      }

      .home,
      .away,
      .analysis {
        @apply flex-1;
      }

      .analysis {
        @apply flex flex-col text-center;
      }

      .analysis span:nth-child(2) {
        @apply text-rs-font-size-small text-rs-color-text-2;
      }
    }

    .playersWithStreak,
    .strongAtHomeOrAway {
      .home,
      .away,
      .analysis {
        @apply self-center;
      }
    }

    .playersWithStreak {
      .home,
      .away {
        @apply flex flex-col gap-3;
      }
    }

    .player,
    .strongTeam {
      @apply text-rs-color-primary font-semibold;
    }

    .scorer-stat {
      @apply flex flex-col gap-1;
    }

    .goal-sequence {
      @apply flex gap-1;
    }

    .home .goal-sequence {
      @apply justify-end;
    }

    .away .goal-sequence {
      @apply justify-start;
    }

    .goal-count {
      @apply min-w-6 rounded px-1 py-0.5 text-center text-rs-color-text-1;
      background-color: var(--rs-color-bg);

      &:last-child {
        @apply border-b-2 border-rs-color-primary;
      }
    }

    @media (max-width: 640px) {
      .fixture-analyse {
        @apply p-4;
      }

      .playersWithStreak .home,
      .playersWithStreak .away,
      .playersWithStreak .analysis {
        @apply min-w-0;
      }

      .scorer-stat {
        @apply gap-0.5;
      }

      .player {
        @apply text-xs;
      }

      .goal-sequence {
        @apply gap-0.5;
      }

      .goal-count {
        @apply min-w-4 px-0 text-xs leading-5;
      }

      .playersWithStreak .analysis span:nth-child(2) {
        @apply text-xs;
      }
    }
  `,
  template: `
    <div class="fixture-analyse">
      <div class="playersWithStreak">
        <div class="home">
          @if (analyses().playersWithStreak.home.length > 0) { @for ( scorer of
          analyses().playersWithStreak.home; track $index ) {
          <div class="scorer-stat">
            <div class="player">{{ scorer.name }}</div>
            <div
              class="goal-sequence"
              aria-label="Tore pro Spiel, vom ältesten zum neuesten"
            >
              @for (goals of scorer.goalsByMatch; track $index) {
              <span class="goal-count">{{ goals }}</span>
              }
            </div>
          </div>
          } } @else { - }
        </div>

        <div class="analysis">
          <span>Torjäger</span>
          <span>3+ Spiele in Folge (letzte 5)</span>
        </div>

        <div class="away">
          @if (analyses().playersWithStreak.away.length > 0) { @for ( scorer of
          analyses().playersWithStreak.away; track $index ) {
          <div class="scorer-stat">
            <div class="player">{{ scorer.name }}</div>
            <div
              class="goal-sequence"
              aria-label="Tore pro Spiel, vom ältesten zum neuesten"
            >
              @for (goals of scorer.goalsByMatch; track $index) {
              <span class="goal-count">{{ goals }}</span>
              }
            </div>
          </div>
          } } @else { - }
        </div>
      </div>

      <div class="strongAtHomeOrAway">
        <div class="home">
          @if (analyses().homeOrAwayStrong?.home === false) { Nein } @else if
          (analyses().homeOrAwayStrong?.home === true) {
          <span class="strongTeam">Ja</span>
          } @else { - }
        </div>

        <div class="analysis">
          <span>Heimstark / Auswärtsstark</span>
        </div>

        <div class="away">
          @if (analyses().homeOrAwayStrong?.away === false) { Nein } @else if
          (analyses().homeOrAwayStrong?.away === true) {
          <span class="strongTeam">Ja</span>
          } @else { - }
        </div>
      </div>
    </div>
  `,
})
export class AnalysesPredictionsComponent {
  readonly analyses = input.required<AnalysesDTO>();
}
