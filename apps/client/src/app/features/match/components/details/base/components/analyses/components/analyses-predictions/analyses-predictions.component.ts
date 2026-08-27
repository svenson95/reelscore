import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PageTitleComponent } from '@app/shared';
import type { AnalysesDTO } from '@lib/models';

@Component({
  selector: 'rs-match-fixture-analyses-predictions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent],
  styles: `
    :host {
      @apply flex flex-col;
    }

    .fixture-analyse {
      @apply mx-3 mb-3 mt-rs1 p-5
        bg-rs-button-bg rounded-border2 shadow-rs3
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

    .player,
    .strongTeam {
      @apply text-rs-color-primary font-semibold;
    }
  `,
  template: `
    <rs-page-title title="Analysen" />

    <div class="fixture-analyse">
      <div class="playersWithStreak">
        <div class="home">
          @if (analyses().playersWithStreak.home.length > 0) { @for ( player of
          analyses().playersWithStreak.home; track $index ) {
          <div class="player">{{ player }}</div>
          } } @else { - }
        </div>

        <div class="analysis">
          <span>Torjäger</span>
          <span>3+ Spiele in Folge getroffen</span>
        </div>

        <div class="away">
          @if (analyses().playersWithStreak.away.length > 0) { @for ( player of
          analyses().playersWithStreak.away; track $index ) {
          <div class="player">{{ player }}</div>
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
