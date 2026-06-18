import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { type EventWithResult, STATUS_TYPES_FINISHED } from '@lib/models';

import { FixtureStore } from '../../../../../store';

import { MatchEventComponent } from './components';
import { TimeTotalPipe } from './pipes';

type MatchTimelineItem =
  | { type: 'spacer'; label: string; key: string }
  | {
      type: 'event';
      event: EventWithResult;
      key: string;
      shootoutResult?: EventWithResult['result'];
    };

@Component({
  selector: 'rs-match-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatchEventComponent, TimeTotalPipe],
  styles: `
    :host { @apply flex flex-col m-3 gap-3 py-rs2 bg-rs-button-bg rounded-fb shadow-rs3; }

    .event-row { @apply flex gap-5 items-center; }
    .event-row > .team { @apply flex-1; }

    .home { @apply text-right; }
    .time { @apply text-rs-font-size-body-2; }
    .result { @apply text-rs-font-size-body-2; }

    .spacer-row {
      @apply flex items-center justify-center text-rs-font-size-body-3 text-rs-color-text-2 uppercase;
    }

    .spacer-row::before,
    .spacer-row::after {
      content: '';
      @apply flex-1 border-t mx-3;
    }

    mat-icon {
      @apply align-middle;

      &.yellow-card { @apply text-yellow-500; }
      &.red-card { @apply text-rs-color-red; }
    }

    .event-row-new {
      overflow: hidden;
      animation: timeline-row-enter 280ms ease-out both;
    }

    .event-content-home-new {
      animation: timeline-home-content-enter 300ms ease-out 120ms both;
    }

    .event-content-away-new {
      animation: timeline-away-content-enter 300ms ease-out 120ms both;
    }

    @keyframes timeline-row-enter {
      from {
        max-height: 0;
        opacity: 0;
        transform: scaleY(0.96);
      }

      to {
        max-height: 96px;
        opacity: 1;
        transform: scaleY(1);
      }
    }

    @keyframes timeline-home-content-enter {
      from {
        transform: translateX(24px);
      }

      to {
        transform: translateX(0);
      }
    }

    @keyframes timeline-away-content-enter {
      from {
        opacity: 0;
        transform: translateX(-24px);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  template: `
    @let homeId = homeTeamId(); @let awayId = awayTeamId(); @for (item of
    timeline(); track item.key) { @if (item.type === 'spacer') {
    <div class="spacer-row">
      <span>{{ item.label }}</span>
    </div>
    } @else { @let event = item.event;

    <div class="event-row" [class.event-row-new]="isNewTimelineItem(item)">
      <div class="team home">
        @if (event.team.id === homeId) {
        <div
          class="event-content-home"
          [class.event-content-home-new]="isNewTimelineItem(item)"
        >
          <rs-match-event [event]="event" [homeTeamId]="homeId" />
        </div>
        } @else {
        <span class="time">{{ event | timeTotal }}'</span>
        }
      </div>

      <div class="event-icon">
        @if (event.type === 'Goal' && event.detail !== 'Missed Penalty') { @let
        eventResult = item.shootoutResult ?? event.result;

        <span class="result">
          <span [class.font-bold]="event.team.id === homeId">
            {{ eventResult.home }}
          </span>
          <span>&nbsp;-&nbsp;</span>
          <span [class.font-bold]="event.team.id === awayId">
            {{ eventResult.away }}
          </span>
        </span>
        } @else if (event.detail === 'Missed Penalty') {
        <mat-icon>close</mat-icon>
        } @else {
        <mat-icon
          [class.yellow-card]="
            event.type === 'Card' && event.detail === 'Yellow Card'
          "
          [class.red-card]="
            event.type === 'Card' && event.detail === 'Red Card'
          "
        >
          @switch(event.type) { @case('subst') { sync } @case('Card') { style }
          @case('Var') { visibility } }
        </mat-icon>
        }
      </div>

      <div class="team away">
        @if (event.team.id === awayId && homeId) {
        <div
          class="event-content-away"
          [class.event-content-away-new]="isNewTimelineItem(item)"
        >
          <rs-match-event [event]="event" [homeTeamId]="homeId" />
        </div>
        } @else {
        <span class="time">{{ event | timeTotal }}'</span>
        }
      </div>
    </div>
    } }
  `,
})
export class MatchEventsComponent {
  private readonly fixtureStore = inject(FixtureStore);

  readonly data = input.required<EventWithResult[]>();

  private readonly fixture = computed(() => this.fixtureStore.fixture());
  readonly homeTeamId = computed(
    () => untracked(this.fixture)?.data.teams.home.id
  );
  readonly awayTeamId = computed(
    () => untracked(this.fixture)?.data.teams.away.id
  );

  private readonly eventsForTimeline = signal<EventWithResult[]>([]);
  private readonly newTimelineEventKeys = signal<Set<string>>(new Set());

  private knownTimelineEventKeys = new Set<string>();
  private initialTimelineDone = false;

  newEvent = effect(() => {
    const events = this.data();
    const nextKeys = events.map((event) => this.getEventKey(event));

    if (!this.initialTimelineDone && events.length === 0) {
      this.eventsForTimeline.set(events);
      this.newTimelineEventKeys.set(new Set());
      return;
    }

    if (!this.initialTimelineDone) {
      this.knownTimelineEventKeys = new Set(nextKeys);
      this.eventsForTimeline.set(events);
      this.newTimelineEventKeys.set(new Set());
      this.initialTimelineDone = true;
      return;
    }

    const addedKeys = nextKeys.filter(
      (key) => !this.knownTimelineEventKeys.has(key)
    );

    this.knownTimelineEventKeys = new Set(nextKeys);

    this.newTimelineEventKeys.set(new Set(addedKeys));
    this.eventsForTimeline.set(events);

    window.setTimeout(() => {
      this.newTimelineEventKeys.set(new Set());
    }, 700);
  });

  readonly timeline = computed<MatchTimelineItem[]>(() => {
    const fixture = this.fixture();
    const fixtureStatus = fixture?.data.fixture.status.short ?? '';
    const isFinished = STATUS_TYPES_FINISHED.includes(fixtureStatus);

    const events = [...this.eventsForTimeline()].sort(
      (a, b) => this.getTotalMinute(b) - this.getTotalMinute(a)
    );

    const shootoutResults = this.getShootoutResults(events);
    const items: MatchTimelineItem[] = [];

    if (isFinished) {
      items.push({ type: 'spacer', label: 'ENDE', key: 'end' });
    }

    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      const previousEvent = events[index - 1];

      if (
        previousEvent &&
        this.isPenaltyShootoutEvent(previousEvent) &&
        !this.isPenaltyShootoutEvent(event)
      ) {
        items.push({
          type: 'spacer',
          label: 'ELFMETERSCHIESSEN',
          key: 'penalty-shootout',
        });
      }

      if (
        previousEvent &&
        this.getTotalMinute(previousEvent) > 45 &&
        this.getTotalMinute(event) <= 45
      ) {
        items.push({
          type: 'spacer',
          label: 'HALBZEIT',
          key: 'half-time',
        });
      }

      items.push({
        type: 'event',
        event,
        shootoutResult: shootoutResults.get(event),
        key: this.getEventKey(event),
      });
    }

    items.push({ type: 'spacer', label: 'ANPFIFF', key: 'kickoff' });

    return items;
  });

  isNewTimelineItem(item: MatchTimelineItem): boolean {
    return item.type === 'event' && this.newTimelineEventKeys().has(item.key);
  }

  private getEventKey(event: EventWithResult): string {
    return [
      event.time.elapsed,
      event.time.extra ?? 0,
      event.team.id,
      event.player?.id ?? event.player?.name ?? '',
      event.assist?.id ?? event.assist?.name ?? '',
      event.type,
      event.detail,
    ].join('|');
  }

  private getShootoutResults(
    eventsDesc: EventWithResult[]
  ): Map<EventWithResult, EventWithResult['result']> {
    const resultMap = new Map<EventWithResult, EventWithResult['result']>();

    const shootoutEventsAsc = eventsDesc
      .filter((event) => this.isPenaltyShootoutEvent(event))
      .reverse();

    let home = 0;
    let away = 0;

    for (const event of shootoutEventsAsc) {
      if (this.isSuccessfulShootoutPenalty(event)) {
        if (event.team.id === this.homeTeamId()) {
          home++;
        } else if (event.team.id === this.awayTeamId()) {
          away++;
        }
      }

      resultMap.set(event, {
        home,
        away,
      } as EventWithResult['result']);
    }

    return resultMap;
  }

  private isSuccessfulShootoutPenalty(event: EventWithResult): boolean {
    return (
      this.isPenaltyShootoutEvent(event) &&
      event.type === 'Goal' &&
      event.detail !== 'Missed Penalty'
    );
  }

  private isPenaltyShootoutEvent(event: EventWithResult): boolean {
    const fixture = this.fixture();
    const penaltyScore = fixture?.data.score?.penalty;

    const hasPenaltyShootout =
      penaltyScore?.home !== null || penaltyScore?.away !== null;

    if (!hasPenaltyShootout) {
      return false;
    }

    const detail = event.detail.toLowerCase();

    return (
      this.getTotalMinute(event) >= 120 &&
      (detail === 'penalty' || detail === 'missed penalty')
    );
  }

  private getTotalMinute(event: EventWithResult): number {
    return event.time.elapsed + (event.time.extra ?? 0);
  }
}
