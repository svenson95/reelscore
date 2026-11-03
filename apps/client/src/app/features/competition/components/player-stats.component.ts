import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { type TopScorer } from '@reelscore-sdk/models';

import {
  getNationalityFlagUrl,
  PageTitleComponent,
  TeamNamePipe,
} from '@app/shared';

import { TopAssistsStore, TopScorersStore } from '../state';
import { getAssistProviders, getGoalScorers } from '../utils';

@Component({
  selector: 'rs-competition-player-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent, TeamNamePipe],
  styles: `
    :host { @apply flex max-[700px]:flex-col gap-rs2 flex-wrap pb-4; }
    .no-data { @apply min-[700px]:mx-auto pt-10 mt-3; }
    .column { @apply flex-1 flex flex-col gap-rs1; }
    .stats { @apply flex flex-col p-rs1 mx-3 bg-rs-button-bg shadow-rs rounded-rs; }
    .player-stat { @apply flex items-center justify-between gap-2 bg-rs-button-bg px-2 py-1; }
    .player-stat:not(:last-child) { @apply border-b; }
    .player-photo-frame { @apply mx-3 h-[34px] w-[34px]; }
    .player-photo { @apply block h-full w-full rounded-full object-cover; }
    .player-row { @apply flex min-w-0 flex-1 items-center; }
    .stat-rank { @apply w-5 shrink-0 text-right text-rs-font-size-body-2 font-medium; }
    .player-details { @apply flex min-w-0 flex-1 flex-col; }
    .player-main-row { @apply flex min-w-0 flex-wrap items-center gap-x-2; }
    .player-name { @apply min-w-0 text-rs-font-size-body-2 font-medium; }
    .player-nationality-flag { @apply h-3 w-4; }
    .team-name { @apply max-w-full break-words text-rs-color-text-2 text-rs-font-size-small; }
    .stat-value {
      @apply flex size-8 shrink-0 items-center justify-center rounded-full text-rs-font-size-body-2 font-semibold;
      background-color: var(--mat-sys-surface);

      @media (prefers-color-scheme: dark) {
        box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 4px 0px inset;
      }

      @media (prefers-color-scheme: light) {
        box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 4px 0px inset;
      }
    }
  `,
  template: `
    @if (isDataLoaded()) {
    <div class="column">
      <rs-page-title title="Torschützen"></rs-page-title>

      @if (goalScorer().length > 0) {
      <div class="stats">
        @for (stat of goalScorer(); track stat.player.id; let idx = $index) {
        <div class="player-stat">
          <div class="player-row">
            <span class="stat-rank">{{ idx + 1 }}</span>
            <span class="rs-photo-frame player-photo-frame">
              <img
                class="player-photo"
                alt="Spieler-Foto"
                [src]="stat.player.photo"
                referrerpolicy="no-referrer"
              />
            </span>
            <div class="player-details">
              <div class="player-main-row">
                <span class="player-name">{{ stat.player.name }}</span>
                @if (nationalityFlagUrl(stat.player.nationality); as flagUrl) {
                <img
                  class="rs-nationality-flag player-nationality-flag"
                  [src]="flagUrl"
                  [alt]="stat.player.nationality"
                />
                }
              </div>
              <span class="team-name">
                {{ stat.statistics[0].team.name | teamName }}
              </span>
            </div>
          </div>

          <span class="stat-value">
            {{ stat.statistics[0].goals.total }}
          </span>
        </div>
        }
      </div>
      } @else {
      <p class="no-data">Keine Torschützen vorhanden</p>
      }
    </div>

    <div class="column">
      <rs-page-title title="Vorlagengeber"></rs-page-title>

      @if (assists().length > 0) {
      <div class="stats">
        @for (stat of assists(); track stat.player.id; let idx = $index) {
        <div class="player-stat">
          <div class="player-row">
            <span class="stat-rank">{{ idx + 1 }}</span>
            <span class="rs-photo-frame player-photo-frame">
              <img
                class="player-photo"
                alt="Spieler-Foto"
                [src]="stat.player.photo"
                referrerpolicy="no-referrer"
              />
            </span>
            <div class="player-details">
              <div class="player-main-row">
                <span class="player-name">{{ stat.player.name }}</span>
                @if (nationalityFlagUrl(stat.player.nationality); as flagUrl) {
                <img
                  class="rs-nationality-flag player-nationality-flag"
                  [src]="flagUrl"
                  [alt]="stat.player.nationality"
                />
                }
              </div>
              <span class="team-name">
                {{ stat.statistics[0].team.name | teamName }}
              </span>
            </div>
          </div>

          <span class="stat-value">
            {{ stat.statistics[0].goals.assists }}
          </span>
        </div>
        }
      </div>
      } @else {
      <p class="no-data">Keine Vorlagengeber vorhanden</p>
      }
    </div>
    } @else if (isLoading()) {
    <p class="no-data">Spieler-Statistiken werden geladen ...</p>
    } @else if (error()) {
    <p class="no-data">Spieler-Statistiken konnten nicht geladen werden.</p>
    } @else {
    <p class="no-data">Keine Daten gefunden</p>
    }
  `,
})
export class PlayerStatsComponent {
  protected readonly nationalityFlagUrl = getNationalityFlagUrl;

  private readonly topScorersStore = inject(TopScorersStore);
  private readonly topAssistsStore = inject(TopAssistsStore);

  private readonly topScorers = this.topScorersStore.topScorers;
  private readonly topAssists = this.topAssistsStore.topAssists;

  protected readonly isLoading = computed<boolean>(
    () => this.topScorersStore.isLoading() || this.topAssistsStore.isLoading()
  );

  protected readonly error = computed<string | null>(
    () => this.topScorersStore.error() ?? this.topAssistsStore.error()
  );

  readonly goalScorer = computed<TopScorer[]>(() =>
    getGoalScorers(this.topScorers()?.response ?? [])
  );

  readonly assists = computed<TopScorer[]>(() =>
    getAssistProviders(this.topAssists()?.response ?? [])
  );

  readonly isDataLoaded = computed<boolean>(
    () => this.topScorers() !== null && this.topAssists() !== null
  );
}
