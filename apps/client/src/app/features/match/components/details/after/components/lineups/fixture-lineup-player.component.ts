import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import type {
  LineupPlayer,
  MatchPlayerStatistics,
} from '@reelscore-sdk/models';

import type { LineupPlayerEvent } from './lineup-player-events';

@Component({
  selector: 'rs-fixture-lineup-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, NgTemplateOutlet],
  template: `
    @if (statistics(); as stats) {
    <details class="border-b border-rs-border-color-1 last:border-0">
      <summary
        class="flex min-h-14 cursor-pointer list-none items-center gap-3 py-2 text-rs-color-text-1 max-[480px]:gap-2 max-[480px]:min-h-[3.25rem]"
      >
        <ng-container *ngTemplateOutlet="playerContent" />
        <mat-icon
          class="shrink-0 text-rs-color-text-2 transition-transform [details[open]_&]:rotate-180"
          aria-hidden="true"
        >
          expand_more
        </mat-icon>
      </summary>
      <dl
        class="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 p-3 text-sm text-rs-color-text-1 [background:var(--rs-color-surface-2)]"
      >
        <dt>Spielminuten</dt>
        <dd class="text-right">{{ stats.games.minutes ?? '–' }}</dd>
        <dt>Tore</dt>
        <dd class="text-right">{{ stats.goals.total ?? '–' }}</dd>
        <dt>Vorlagen</dt>
        <dd class="text-right">{{ stats.goals.assists ?? '–' }}</dd>
        <dt>Schüsse aufs Tor</dt>
        <dd class="text-right">{{ stats.shots.on ?? '–' }}</dd>
        <dt>Pässe</dt>
        <dd class="text-right">{{ stats.passes.total ?? '–' }}</dd>
        <dt>Gelbe Karten</dt>
        <dd class="text-right">{{ stats.cards.yellow ?? '–' }}</dd>
        <dt>Rote Karten</dt>
        <dd class="text-right">{{ stats.cards.red ?? '–' }}</dd>
      </dl>
    </details>
    } @else {
    <div class="border-b border-rs-border-color-1 last:border-0">
      <div
        class="flex min-h-14 items-center gap-3 py-2 text-rs-color-text-1 max-[480px]:gap-2 max-[480px]:min-h-[3.25rem]"
      >
        <ng-container *ngTemplateOutlet="playerContent" />
      </div>
    </div>
    }

    <ng-template #playerContent>
      <span
        class="w-6 shrink-0 text-right text-xs font-semibold text-rs-color-text-2 max-[480px]:w-5"
        >{{ player().number ?? '–' }}</span
      >
      <span
        class="rs-photo-frame relative grid size-10 shrink-0 place-items-center text-rs-color-text-2 [background:var(--rs-color-surface-2)] max-[480px]:size-9"
      >
        <mat-icon class="[grid-area:1/1]" aria-hidden="true">person</mat-icon>
        @if (photoUrl()) {
        <img
          class="[grid-area:1/1] block h-full w-full rounded-full object-cover object-top"
          [src]="photoUrl()"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
          (error)="hidePhoto($event)"
        />
        }
      </span>
      <span class="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span class="flex min-w-0 flex-wrap items-center gap-1">
          <span
            class="min-w-0 break-words text-rs-color-text-1 text-rs-font-size-body-2 font-medium leading-[1.15]"
            >{{ player().name ?? 'Unbekannt' }}</span
          >
          @if (captain()) {
          <span
            class="grid size-4 place-items-center rounded-full border border-current text-[0.6rem] font-bold"
            role="img"
            aria-label="Mannschaftskapitän"
            title="Mannschaftskapitän"
            >C</span
          >
          }
        </span>
        @if (position()) {
        <span class="text-xs leading-tight text-rs-color-text-2">{{
          position()
        }}</span>
        }
      </span>
      @if (nonGoalEvents().length) {
      <span
        class="inline-flex shrink-0 flex-wrap items-center justify-end gap-1 max-[480px]:gap-0.5"
      >
        @for (event of nonGoalEvents(); track $index) {
        <span
          class="event-marker"
          [class]="event.type"
          [class.order-1]="
            event.type === 'substitution-in' ||
            event.type === 'substitution-out'
          "
          [class.order-2]="
            event.type === 'yellow-card' || event.type === 'red-card'
          "
          role="img"
          [attr.aria-label]="event.label"
          [title]="event.label"
        >
          @if (event.type === 'substitution-in') {
          <mat-icon aria-hidden="true">arrow_upward</mat-icon
          ><span aria-hidden="true">{{ event.minute }}</span> } @else if
          (event.type === 'substitution-out') {
          <mat-icon aria-hidden="true">arrow_downward</mat-icon
          ><span aria-hidden="true">{{ event.minute }}</span> } @else if
          (event.type === 'yellow-card' || event.type === 'red-card') {
          <span
            class="event-card"
            [class.yellow-card]="event.type === 'yellow-card'"
            [class.red-card]="event.type === 'red-card'"
          ></span>
          }
        </span>
        }
      </span>
      } @if (goalEvents().length) {
      <span class="inline-flex shrink-0 items-center gap-1">
        @for (event of goalEvents(); track $index) {
        <span
          class="event-marker goal-marker"
          role="img"
          [attr.aria-label]="event.label"
          [title]="event.label"
        >
          <mat-icon aria-hidden="true">sports_soccer</mat-icon>
          @if (event.type === 'goal' && event.count && event.count > 1) {
          <span class="goal-count" aria-hidden="true">{{ event.count }}</span> }
        </span>
        }
      </span>
      } @if (ratingClass()) {
      <span class="rating" [class]="ratingClass()">{{
        formattedRating()
      }}</span>
      }
    </ng-template>
  `,
  styles: `
    .event-marker { @apply relative inline-flex items-center gap-px text-[0.7rem] font-semibold max-[480px]:text-[0.65rem]; }
    .event-marker mat-icon { @apply size-4 text-base leading-none; }
    .substitution-in { color: #248a42; }
    .substitution-out { color: #d04740; }
    .event-card { @apply block h-3 w-[0.55rem] rounded-[1px]; }
    .yellow-card { background: #f3cb4d; }
    .red-card { background: #d33131; }
    .goal-marker { @apply mr-1; }
    .goal-count { @apply absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full border border-rs-button-bg bg-[#d33131] px-0.5 text-[0.55rem] font-bold leading-none text-white; }
    .rating { @apply min-w-10 rounded-md px-1.5 py-1 text-center text-xs font-semibold max-[480px]:min-w-[2.35rem] max-[480px]:px-1; background: var(--rs-color-surface-2); }
    .rating-red { background: #c82828; color: white; }
    .rating-orange { background: #d85b2c; color: white; }
    .rating-yellow { background: #f3cb4d; color: #292000; }
    .rating-green { background: #9bd47b; color: #14330b; }
    .rating-bright-green { background: #25b34a; color: #08290f; }
  `,
})
export class FixtureLineupPlayerComponent {
  readonly player = input.required<LineupPlayer>();
  readonly statistics = input<MatchPlayerStatistics | null>(null);
  readonly photoUrl = input<string | null>(null);
  readonly position = input<string | undefined>();
  readonly captain = input(false);
  readonly playerEvents = input<readonly LineupPlayerEvent[]>([]);
  readonly ratingClass = input<string | null>(null);
  readonly formattedRating = input('');

  protected readonly nonGoalEvents = () =>
    this.playerEvents().filter(
      (event) => event.type !== 'goal' && event.type !== 'own-goal'
    );
  protected readonly goalEvents = () =>
    this.playerEvents().filter(
      (event) => event.type === 'goal' || event.type === 'own-goal'
    );

  protected hidePhoto(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }
}
