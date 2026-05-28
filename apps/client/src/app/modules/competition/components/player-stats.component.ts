import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { TopScorer } from '@lib/models';

import { TopScorersStore } from '../store';

@Component({
  selector: 'rs-competition-player-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply rs-competition-tab max-[500px]:flex-col gap-rs2 flex-wrap mx-2; }
    .column { @apply flex-1; }
    h2 { @apply mb-4 border-b border-rs-color-primary; }
    .divider { @apply self-stretch min-[500px]:w-px max-[500px]:hidden bg-rs-color-primary; }
    .player-stat { @apply flex justify-between; }
    .player-stat:not(:last-child) { @apply mb-2; }
    img { @apply inline-block w-[24px] h-[24px] mr-4 rounded-full; }
  `,
  template: `
    @if (topScorers() !== null) {
    <div class="column">
      <h2>Torschützen</h2>
      @for (stat of goalScorer(); track stat.player.id; let idx = $index) {
      <div class="player-stat">
        <div class="player-name">
          <img [src]="stat.player.photo" />
          <span>{{ stat.player.name }}</span>
        </div>
        <span>{{ stat.statistics[0].goals.total }}</span>
      </div>
      }
    </div>

    <div class="divider"></div>

    <div class="column">
      <h2>Vorlagen</h2>
      @for (stat of assists(); track stat.player.id; let idx = $index) {
      <div class="player-stat">
        <div class="player-name">
          <img [src]="stat.player.photo" />
          <span>{{ stat.player.name }}</span>
        </div>
        <span>{{ stat.statistics[0].goals.assists }}</span>
      </div>
      }
    </div>
    } @else if (isLoading()) {
    <p class="no-data">Spieler-Statistiken werden geladen ...</p>
    } @else {
    <p class="no-data">Keine Daten gefunden</p>
    }
  `,
})
export class PlayerStatsComponent {
  private readonly store = inject(TopScorersStore);
  readonly topScorers = this.store.topScorers;
  readonly isLoading = this.store.isLoading;

  readonly goalScorer = computed(() => {
    const data = [...(this.topScorers()?.response ?? [])];
    const goals = (d: TopScorer) => d.statistics[0].goals.total ?? 0;
    return data.sort((a, b) => goals(b) - goals(a));
  });

  readonly assists = computed(() => {
    const data = [...(this.topScorers()?.response ?? [])];
    const assists = (d: TopScorer) => d.statistics[0].goals.assists ?? 0;
    return data.sort((a, b) => assists(b) - assists(a));
  });
}
