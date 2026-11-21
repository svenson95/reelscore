import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import type {
  EventWithResult,
  LineupDTO,
  LineupPlayer,
  MatchPlayerStatisticsDTO,
} from '@reelscore-sdk/models';

import { TeamNamePipe } from '@app/shared';

import { FixtureLineupsStore } from '../../../../../state';

import { getLineupPlayerEvents, ratingCategory } from './lineup-player-events';

import { FixtureLineupPlayerComponent } from './fixture-lineup-player.component';

type FormationRow = { key: string; players: LineupPlayer[] };

const PLAYER_IMAGE_BASE_URL = 'https://media.api-sports.io/football/players/';
const POSITION_LABELS: Record<string, string> = {
  G: 'Torwart',
  GK: 'Torwart',
  D: 'Abwehr',
  CB: 'Innenverteidiger',
  RB: 'Rechter Verteidiger',
  LB: 'Linker Verteidiger',
  M: 'Mittelfeld',
  CM: 'Zentrales Mittelfeld',
  DM: 'Defensives Mittelfeld',
  AM: 'Offensives Mittelfeld',
  F: 'Stürmer',
  RW: 'Rechter Flügel',
  LW: 'Linker Flügel',
  CF: 'Mittelstürmer',
  ST: 'Stürmer',
};

@Component({
  selector: 'rs-fixture-lineups',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, TeamNamePipe, FixtureLineupPlayerComponent],
  styles: `
    :host { display: block; }
    .teams { display: grid; gap: 1rem; margin: 0 0.75rem; }
    .team { border-radius: var(--rs-size-border-radius); background: var(--rs-button-bg-color); padding: 1rem; }
    .team-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; margin-inline: 0.25rem; }
    .team-header img { width: 2rem; height: 2rem; object-fit: contain; }
    .team-header h3 { flex: 1; font-weight: 600; }
    .team-header span { @apply text-rs-font-size-body-2; }
    .pitch {
      --pitch-line-color: rgb(255 255 255 / 45%);
      container-type: inline-size;

      position: relative;
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      aspect-ratio: 1.35 / 1;
      padding: 1rem 0.5rem;
      border-radius: 0.5rem;
      background: #237749;
      color: white;
    }

    .pitch::before,
    .pitch::after,
    .pitch-markings::before,
    .pitch-markings::after {
      position: absolute;
      border: 1px solid var(--pitch-line-color);
      pointer-events: none;
      content: '';
    }

    .pitch::before {
      inset: 0.5rem;
    }

    .pitch::after {
      top: 50%;
      right: calc(0.5rem - 2.25rem);
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 50%;
      clip-path: inset(0 50% 0 0);
      transform: translateY(-50%);
    }

    .pitch-away::after {
      right: auto;
      left: calc(0.5rem - 2.25rem);
      clip-path: inset(0 0 0 50%);
      transform: translateY(-50%);
    }

    .pitch-markings {
      position: absolute;
      inset: 0.5rem;
      pointer-events: none;
      background:
        radial-gradient(circle at top left, transparent 0.5rem, var(--pitch-line-color) 0.5rem, var(--pitch-line-color) calc(0.5rem + 1px), transparent calc(0.5rem + 1px)) top left / 1rem 1rem no-repeat,
        radial-gradient(circle at bottom left, transparent 0.5rem, var(--pitch-line-color) 0.5rem, var(--pitch-line-color) calc(0.5rem + 1px), transparent calc(0.5rem + 1px)) bottom left / 1rem 1rem no-repeat;
    }

    .pitch-markings::before {
      top: 25%;
      left: 0;
      width: 22%;
      height: 50%;
      border-left: 0;
    }

    .pitch-markings::after {
      top: 37.5%;
      left: 0;
      width: 8%;
      height: 25%;
      border-left: 0;
    }

    .pitch-away { flex-direction: row-reverse; }
    .pitch-away .pitch-markings { transform: scaleX(-1); }
    .formation-row { @apply relative flex min-w-0 flex-1 flex-col justify-around; }
    .pitch-player { @apply min-w-0 text-center; font-size: clamp(0.625rem, 2.8cqw, 0.8rem); line-height: 1.1; }
    .pitch-player-name { @apply font-medium; display: -webkit-box; overflow: hidden; overflow-wrap: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
    .number { @apply mx-auto grid place-items-center rounded-full bg-white font-bold; width: clamp(1.2rem, 6cqw, 1.65rem); height: clamp(1.2rem, 6cqw, 1.65rem); color: #174c30; }
    .pitch-number { @apply relative mx-auto mb-1 block w-fit; }
    .pitch-number .number { margin: 0; }
    .pitch-captain { position: absolute; z-index: 1; top: -0.2rem; right: -0.35rem; display: grid; width: 1rem; height: 1rem; place-items: center; border: 1px solid #174c30; border-radius: 50%; background: #f3cb4d; color: #292000; font-size: 0.6rem; font-weight: 700; }
    .list-heading { display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0.5rem 0.75rem; }
    .list-heading h4 { display: flex; flex-shrink: 0; align-items: center; gap: 0.45rem; margin: 0; font-size: 0.95rem; font-weight: 500; text-transform: uppercase; font-style: italic; letter-spacing: 0.04em; }
    .list-heading-marker { display: flex; flex-shrink: 0; gap: 0.2rem; transform: skewX(-16deg); }
    .list-heading-marker::before, .list-heading-marker::after { display: block; width: 2px; height: 12px; background: var(--rs-color-primary); content: ''; }
    .list-heading-marker::before { opacity: 0.6; }
    .list-heading-divider { height: 1px; min-width: 0.75rem; flex: 1; background: var(--rs-border-color-2); }
    .list-heading-count { flex-shrink: 0; color: var(--rs-color-text-muted); font-size: 0.75rem; }
    @media (max-width: 480px) {
      .teams { gap: 0.75rem; margin: 0 0.5rem; }
      .team { padding: 0.75rem; }
      .team-header { gap: 0.5rem; margin-bottom: 0.75rem; font-size: 0.9rem; }
      .team-header img { width: 1.75rem; height: 1.75rem; }
      .pitch { gap: 0.25rem; padding: 0.75rem 0.35rem; }
      .list-heading { gap: 0.5rem; margin-top: 1.25rem; }
      .list-heading h4 { font-size: 0.85rem; }
    }
    @media (min-width: 768px) { .teams { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `,
  template: `
    @if (loading() && !data()) {
    <p class="no-data" role="status">Aufstellungen werden geladen …</p>
    } @else if (error() && !data()) {
    <p class="no-data" role="status">Fehler beim Laden der Aufstellungen</p>
    } @else if (!teams().length) {
    <p class="no-data">Keine Aufstellungen verfügbar</p>
    } @else { @if (error()) {
    <p class="no-data" role="status">
      Aktualisierung der Aufstellungen fehlgeschlagen.
    </p>
    }
    <div class="teams">
      @for (team of teams(); track team.lineup.team.id ?? $index) {
      <section class="team">
        <header class="team-header">
          @if (team.lineup.team.logo) {
          <img [src]="team.lineup.team.logo" alt="" width="32" height="32" />
          }
          <h3>{{ team.lineup.team.name | teamName : 'long' }}</h3>
          <span>{{ team.lineup.formation }}</span>
        </header>
        <div
          class="pitch"
          [class.pitch-away]="$index === 1"
          aria-label="Startaufstellung"
        >
          <span class="pitch-markings" aria-hidden="true"></span>
          @for (row of team.rows; track row.key) {
          <div class="formation-row">
            @for (player of row.players; track player.id ?? $index) {
            <div class="pitch-player">
              <span class="pitch-number">
                <span class="number">{{ player.number ?? '–' }}</span>
                @if (team.captainIds.has(player.id)) {
                <span
                  class="pitch-captain"
                  role="img"
                  aria-label="Kapitän"
                  title="Kapitän"
                  >C</span
                >
                }
              </span>
              <span
                class="pitch-player-name"
                [title]="player.name ?? 'Unbekannt'"
                >{{ pitchPlayerName(player.name) }}</span
              >
            </div>
            }
          </div>
          }
        </div>
        <div class="list-heading">
          <h4>
            <span class="list-heading-marker" aria-hidden="true"></span>Startelf
          </h4>
          <span class="list-heading-divider" aria-hidden="true"></span>
          <span class="list-heading-count"
            >{{ team.lineup.startXI.length }} Spieler</span
          >
        </div>
        @for (entry of team.lineup.startXI; track entry.player.id ?? $index) {
        <ng-container
          *ngTemplateOutlet="
            playerDetails;
            context: {
              $implicit: entry.player,
              statistics: team.statistics,
              teamId: team.lineup.team.id
            }
          "
        />
        } @if (team.lineup.substitutes.length) {
        <div class="list-heading">
          <h4>
            <span class="list-heading-marker" aria-hidden="true"></span
            >Auswechselspieler
          </h4>
          <span class="list-heading-divider" aria-hidden="true"></span>
          <span class="list-heading-count"
            >{{ team.lineup.substitutes.length }} Spieler</span
          >
        </div>
        @for (entry of team.lineup.substitutes; track entry.player.id ?? $index)
        {
        <ng-container
          *ngTemplateOutlet="
            playerDetails;
            context: {
              $implicit: entry.player,
              statistics: team.statistics,
              teamId: team.lineup.team.id
            }
          "
        />
        } }
      </section>
      }
    </div>
    }
    <ng-template
      #playerDetails
      let-player
      let-statistics="statistics"
      let-teamId="teamId"
    >
      @let matchPlayer = findPlayer(statistics, player.id); @let stats =
      matchPlayer?.statistics?.[0]; @let position =
      positionLabel(stats?.games?.position ?? player.pos); @let photoUrl =
      matchPlayer?.player?.photo || playerPhotoUrl(player.id); @let playerEvents
      = getPlayerEvents(events(), teamId, player.id);
      <rs-fixture-lineup-player
        [player]="player"
        [statistics]="stats ?? null"
        [photoUrl]="photoUrl"
        [position]="position"
        [captain]="stats?.games?.captain ?? false"
        [playerEvents]="playerEvents"
        [ratingClass]="ratingClass(stats?.games?.rating)"
        [formattedRating]="formatRating(stats?.games?.rating)"
      />
    </ng-template>
  `,
})
export class FixtureLineupsComponent {
  readonly events = input<readonly EventWithResult[]>([]);

  private readonly store = inject(FixtureLineupsStore);
  protected readonly data = this.store.data;
  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  protected readonly getPlayerEvents = getLineupPlayerEvents;
  protected readonly ratingClass = ratingCategory;
  protected formatRating(rating: string | null | undefined): string {
    const value = Number(rating);
    return Number.isFinite(value) ? value.toFixed(1) : rating ?? '';
  }

  protected readonly teams = computed(() => {
    const data = this.data();
    return (data?.lineups ?? []).map((lineup) => {
      const statistics = data?.playerStatistics.find(
        (team) => team.team.id === lineup.team.id
      );

      return {
        lineup,
        rows: this.formationRows(lineup),
        statistics,
        captainIds: new Set(
          statistics?.players
            .filter((player) => player.statistics?.[0]?.games?.captain)
            .map((player) => player.player.id) ?? []
        ),
      };
    });
  });

  protected findPlayer(
    team: MatchPlayerStatisticsDTO | undefined,
    playerId: number | null
  ) {
    if (playerId === null) return undefined;
    return team?.players.find((entry) => entry.player.id === playerId);
  }

  protected positionLabel(
    position: string | null | undefined
  ): string | undefined {
    return position
      ? POSITION_LABELS[position.trim().toUpperCase()]
      : undefined;
  }

  protected playerPhotoUrl(playerId: number | null): string | null {
    return playerId != null && playerId > 0
      ? `${PLAYER_IMAGE_BASE_URL}${playerId}.png`
      : null;
  }

  protected pitchPlayerName(name: string | null): string {
    const displayName =
      name?.trim().replace(/^(?:\S\.\s*)+/, '') || 'Unbekannt';
    const characters = Array.from(displayName);

    if (characters.length <= 20) return displayName;

    return `${characters.slice(0, 20).join('').trimEnd()}...`;
  }

  private formationRows(lineup: LineupDTO): FormationRow[] {
    const rows = new Map<string, LineupPlayer[]>();
    for (const { player } of lineup.startXI) {
      const row = player.grid?.split(':')[0] ?? '?';
      const players = rows.get(row) ?? [];
      players.push(player);
      rows.set(row, players);
    }
    return Array.from(rows, ([key, players]) => ({ key, players }));
  }
}
