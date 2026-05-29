import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { TeamNamePipe } from '@app/shared';
import { TopScorer } from '@lib/models';

import { TopScorersStore } from '../store';

@Component({
  selector: 'rs-competition-player-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TeamNamePipe],
  styles: `
    :host { @apply flex max-[700px]:flex-col gap-rs2 flex-wrap; }
    .column { @apply flex-1; }
    h2 { @apply mb-2 ml-4; }
    .divider { @apply mt-3 self-stretch min-[700px]:w-px max-[700px]:hidden bg-rs-color-primary; }
    .player-stat { @apply flex justify-between bg-rs-alt-bg px-4 py-2 border border-rs-border-color-2; }
    .player-stat:not(:last-child) { @apply mb-px; }
    img { @apply inline-block w-[24px] h-[24px] mr-3 rounded-full; }
    .team-name { @apply ml-3 text-rs-color-text-2 text-rs-font-size-body-3; }
    .player-name { @apply text-rs-font-size-body-1; }
    .stat-value { @apply text-rs-font-size-body-1 self-center; }
  `,
  template: `
    @if (topScorers() !== null) {
    <div class="column">
      <h2>Torschützen</h2>
      @for (stat of goalScorer(); track stat.player.id; let idx = $index) {
      <div class="player-stat">
        <div class="player-row">
          <img [src]="stat.player.photo" />
          <span class="player-name">{{ stat.player.name }}</span>
          <span class="team-name">
            {{ stat.statistics[0].team.name | teamName : 'short' }}
          </span>
        </div>
        <span class="stat-value">{{ stat.statistics[0].goals.total }}</span>
      </div>
      }
    </div>

    <div class="divider"></div>

    <div class="column">
      <h2>Vorlagen</h2>
      @for (stat of assists(); track stat.player.id; let idx = $index) {
      <div class="player-stat">
        <div class="player-row">
          <img [src]="stat.player.photo" />
          <span class="player-name">{{ stat.player.name }}</span>
          <span class="team-name">
            {{ stat.statistics[0].team.name | teamName : 'short' }}
          </span>
        </div>
        <span class="stat-value">{{ stat.statistics[0].goals.assists }}</span>
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
