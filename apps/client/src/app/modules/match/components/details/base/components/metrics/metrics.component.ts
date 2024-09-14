import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MetricsStore } from '../../../../../store';

@Component({
  selector: 'reelscore-match-fixture-metrics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col py-7 px-5 gap-5 text-fb-font-size-body-2 sm:text-fb-font-size-body-1; }
    section { @apply w-full flex gap-5; }
    section:not(:last-of-type) { @apply border-b-[1px] pb-5; }
    section > div { @apply flex-1 self-center; }
    section > div:first-child { @apply text-end; }
    section > div:nth-child(2) { @apply text-center; }
    .metric { @apply flex flex-col; }
    .metric span:nth-child(2) { @apply text-fb-font-size-small text-fb-color-text-1; }
  `,
  template: `
    <section class="playersWithStreak">
      <div class="home">
        @if (metrics()!.playersWithStreak.home.length > 0) { @for (player of
        metrics()!.playersWithStreak.home; track $index) {
        <div class="player">{{ player }}</div>
        } } @else { - }
      </div>
      <div class="metric">
        <span>Spieler mit Torserie</span>
        <span>3+ Spiele in Folge getroffen</span>
      </div>
      <div class="away">
        @if (metrics()!.playersWithStreak.away.length > 0) { @for (player of
        metrics()!.playersWithStreak.away; track $index) {
        <div class="player">{{ player }}</div>
        } } @else { - }
      </div>
    </section>

    <section class="strongAtHomeOrAway">
      <div class="home">Ja</div>
      <div class="metric">
        <span>Heimstark / Auswärtsstark</span>
      </div>
      <div class="away">Nein</div>
    </section>
  `,
})
export class MatchFixtureMetricsComponent {
  metricsStore = inject(MetricsStore);
  metrics = this.metricsStore.metrics;
}
