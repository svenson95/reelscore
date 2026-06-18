import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { TeamNamePipe } from '@app/shared';
import type { TopScorer } from '@lib/models';

import { TopScorersStore } from '../store';

@Component({
  selector: 'rs-competition-player-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TeamNamePipe],
  styles: `
    :host { @apply flex max-[700px]:flex-col gap-rs2 flex-wrap mx-3 pb-4; }
    .no-data { @apply min-[700px]:mx-auto pt-10 mt-3; }
    .column { @apply flex-1; }
    h2 { @apply mb-2 ml-4; }
    .player-stat { @apply flex justify-between bg-rs-button-bg px-4 py-2 shadow-rs3; }
    .player-stat:not(:last-child) { @apply border-b; }
    .player-stat:first-of-type { @apply rounded-tl-fb rounded-tr-fb; }
    .player-stat:last-of-type { @apply rounded-bl-fb rounded-br-fb; }
    img { @apply inline-block w-[24px] h-[24px] mx-3 rounded-full; }
    .player-row { @apply flex items-center; }
    .stat-rank { @apply text-rs-font-size-body-1 w-[20px] text-right; }
    .player-name { @apply text-rs-font-size-body-1; }
    .team-name { @apply ml-3 text-rs-color-text-2 text-rs-font-size-body-3; }
    .stat-value { @apply text-rs-font-size-body-1 self-center; }
  `,
  template: `
    @if (topScorers() !== null) {
    <div class="column">
      <h2>Torschützen</h2>
      @for (stat of goalScorer(); track stat.player.id; let idx = $index) {
      <div class="player-stat">
        <div class="player-row">
          <span class="stat-rank">{{ idx + 1 }}.</span>
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

    <div class="column">
      <h2>Vorlagen</h2>
      @for (stat of assists(); track stat.player.id; let idx = $index) {
      <div class="player-stat">
        <div class="player-row">
          <span class="stat-rank">{{ idx + 1 }}.</span>
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

  readonly goalScorer = computed(() =>
    [...(this.topScorers()?.response ?? [])].sort((a, b) => {
      const aStats = this.getStats(a);
      const bStats = this.getStats(b);

      return (
        bStats.goals - aStats.goals ||
        aStats.penaltyGoals - bStats.penaltyGoals ||
        bStats.assists - aStats.assists ||
        aStats.minutes - bStats.minutes
      );
    })
  );

  readonly assists = computed(() =>
    [...(this.topScorers()?.response ?? [])].sort((a, b) => {
      const aStats = this.getStats(a);
      const bStats = this.getStats(b);

      return (
        bStats.assists - aStats.assists ||
        bStats.goals - aStats.goals ||
        aStats.minutes - bStats.minutes
      );
    })
  );

  private getStats(stat: TopScorer) {
    const statistics = stat.statistics[0];

    return {
      goals: statistics.goals.total ?? 0,
      penaltyGoals: statistics.penalty.scored ?? 0,
      assists: statistics.goals.assists ?? 0,
      minutes: statistics.games.minutes ?? 0,
    };
  }
}
