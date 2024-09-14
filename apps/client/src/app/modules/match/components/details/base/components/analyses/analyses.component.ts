import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AnalysesStore } from '../../../../../store';

@Component({
  selector: 'reelscore-match-fixture-analyses',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col py-7 px-5 gap-5 text-fb-font-size-small sm:text-fb-font-size-body-1; }
    section { @apply w-full flex gap-5; }
    section:not(:last-of-type) { @apply border-b-[1px] pb-5; }
    .home { @apply text-end; }
    .home, .away { @apply flex-1; }
    .analysis { @apply flex flex-col flex-2 text-center; }
    .analysis span:nth-child(2) { @apply text-fb-font-size-small text-fb-color-text-2; }
    .home, .away, .analysis { @apply self-center; }
  `,
  template: `
    <section class="playersWithStreak">
      <div class="home">
        @if (analyses()!.playersWithStreak.home.length > 0) { @for (player of
        analyses()!.playersWithStreak.home; track $index) {
        <div class="player">{{ player }}</div>
        } } @else { - }
      </div>
      <div class="analysis">
        <span>Spieler mit Torserie</span>
        <span>3+ Spiele in Folge getroffen</span>
      </div>
      <div class="away">
        @if (analyses()!.playersWithStreak.away.length > 0) { @for (player of
        analyses()!.playersWithStreak.away; track $index) {
        <div class="player">{{ player }}</div>
        } } @else { - }
      </div>
    </section>

    <section class="strongAtHomeOrAway">
      <div class="home">
        {{ analyses()?.homeOrAwayStrong?.home === false ? 'Nein' : 'Ja' }}
      </div>
      <div class="analysis">
        <span>Heimstark / Auswärtsstark</span>
      </div>
      <div class="away">
        {{ analyses()?.homeOrAwayStrong?.away === false ? 'Nein' : 'Ja' }}
      </div>
    </section>
  `,
})
export class MatchFixtureAnalysesComponent {
  analysesStore = inject(AnalysesStore);
  analyses = this.analysesStore.analyses;
}
