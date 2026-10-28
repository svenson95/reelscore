import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { STATUS_VALUES_FINISHED } from '@reelscore-sdk/constants';
import type { EventWithResult } from '@reelscore-sdk/models';

import { FixtureStore } from '../../../../../state';
import {
  hasFirstHalfEvents,
  isExtraTimeEvent,
  isPenaltyShootoutEvent,
  isSecondHalfEvent,
} from '../../../../../utils/event-timeline.helper';

import { MatchEventComponent } from './components';
import { TimeTotalPipe } from './pipes';
import type { MatchTimelineItem } from './types';

import {
  mergeSecondYellowCardEvents,
  SECOND_YELLOW_CARD_COMMENT,
} from './second-yellow-card.helper';

@Component({
  selector: 'rs-match-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatchEventComponent, TimeTotalPipe],
  styles: `
    :host {
      @apply flex flex-col
        bg-rs-button-bg rounded-border2 shadow-rs
        mx-3 mb-3 mt-rs1 gap-2 py-rs2;
    }

    .event-row { @apply flex gap-4 items-center; }
    .event-row > .team { @apply flex-1; }
    .event-icon { @apply flex min-w-8 shrink-0 items-center justify-center; }

    .home { @apply text-right; }
    .time { @apply text-rs-font-size-body-3; }
    .result { @apply text-rs-font-size-body-3; }

    .spacer-row {
      @apply flex items-center justify-center text-rs-font-size-body-3 text-rs-color-text-2 uppercase;
    }

    .spacer-row::before,
    .spacer-row::after {
      content: '';
      @apply flex-1 border-t mx-3;
    }

    mat-icon { @apply align-middle; }

    .card-icon {
      @apply relative inline-block h-4 w-2.5 rounded-[2px] border border-black/10;
      transform: rotate(-8deg);
    }

    .yellow-card { @apply bg-yellow-400; }
    .red-card { @apply bg-rs-color-red; }

    .card-stack {
      @apply relative inline-block h-5 w-4 overflow-hidden;
    }

    .card-stack::before,
    .card-stack::after {
      content: '';
      @apply absolute h-4 w-2.5 rounded-[2px] border border-black/10;
      transform: rotate(-8deg);
    }

    .card-stack::before {
      @apply left-[-7px] top-0 z-0 bg-yellow-400;
    }

    .card-stack::after {
      @apply right-0 bottom-0 z-10 bg-rs-color-red;
      transform: rotate(8deg);
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
        } @else if (event.type === 'Card' && isSecondYellowCard(event)) {
        <span class="card-stack" role="img" aria-label="Gelb-Rote Karte"></span>
        } @else if (event.type === 'Card' && event.detail === 'Yellow Card') {
        <span
          class="card-icon yellow-card"
          role="img"
          aria-label="Gelbe Karte"
        ></span>
        } @else if (event.type === 'Card' && event.detail === 'Red Card') {
        <span
          class="card-icon red-card"
          role="img"
          aria-label="Rote Karte"
        ></span>
        } @else {
        <mat-icon aria-hidden="true">
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
  readonly data = input.required<EventWithResult[]>();

  private readonly fixtureStore = inject(FixtureStore);

  private readonly fixture = computed(() => this.fixtureStore.fixture());
  protected readonly homeTeamId = computed(
    () => this.fixture()?.data.teams.home.id
  );
  protected readonly awayTeamId = computed(
    () => this.fixture()?.data.teams.away.id
  );

  private readonly eventsForTimeline = signal<EventWithResult[]>([]);
  private readonly newTimelineEventKeys = signal<Set<string>>(new Set());

  private knownTimelineEventKeys = new Set<string>();
  private hasInitialTimeline = false;

  protected readonly timeline = computed<MatchTimelineItem[]>(() => {
    const fixture = this.fixture();
    const fixtureStatus = fixture?.data.fixture.status.short ?? '';
    const isFinished = STATUS_VALUES_FINISHED.includes(fixtureStatus);

    const events = mergeSecondYellowCardEvents(this.eventsForTimeline()).sort(
      (a, b) => this.getTotalMinute(b) - this.getTotalMinute(a)
    );

    const shootoutResults = this.getShootoutResults(events);
    const items: MatchTimelineItem[] = [];
    const hasFirstHalf = hasFirstHalfEvents(
      events,
      fixture?.data.score.penalty
    );

    if (isFinished) {
      items.push({ type: 'spacer', label: 'ENDE', key: 'end' });
    }

    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      const previousEvent = events[index - 1];

      if (
        previousEvent &&
        isPenaltyShootoutEvent(previousEvent, fixture?.data.score.penalty) &&
        !isPenaltyShootoutEvent(event, fixture?.data.score.penalty)
      ) {
        items.push({
          type: 'spacer',
          label: 'ELFMETERSCHIESSEN',
          key: 'penalty-shootout',
        });
      }

      if (
        previousEvent &&
        isExtraTimeEvent(
          previousEvent,
          fixture?.data.score.extratime,
          fixture?.data.score.penalty
        ) &&
        !isExtraTimeEvent(
          event,
          fixture?.data.score.extratime,
          fixture?.data.score.penalty
        )
      ) {
        items.push({
          type: 'spacer',
          label: 'VERLÄNGERUNG',
          key: 'extra-time',
        });
      }

      if (
        previousEvent &&
        hasFirstHalf &&
        isSecondHalfEvent(
          previousEvent,
          fixture?.data.score.halftime,
          fixture?.data.score.penalty
        ) &&
        !isSecondHalfEvent(
          event,
          fixture?.data.score.halftime,
          fixture?.data.score.penalty
        )
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

  private readonly trackNewTimelineEvents = effect((onCleanup) => {
    const events = this.data();
    const currentEventKeys = mergeSecondYellowCardEvents(events).map((event) =>
      this.getEventKey(event)
    );

    if (!this.hasInitialTimeline && events.length === 0) {
      this.eventsForTimeline.set(events);
      this.newTimelineEventKeys.set(new Set());

      return;
    }

    // The first batch represents existing events and should not animate as a live update.
    if (!this.hasInitialTimeline) {
      this.knownTimelineEventKeys = new Set(currentEventKeys);
      this.eventsForTimeline.set(events);
      this.newTimelineEventKeys.set(new Set());
      this.hasInitialTimeline = true;

      return;
    }

    const newEventKeys = currentEventKeys.filter(
      (key) => !this.knownTimelineEventKeys.has(key)
    );

    this.knownTimelineEventKeys = new Set(currentEventKeys);

    this.newTimelineEventKeys.set(new Set(newEventKeys));
    this.eventsForTimeline.set(events);

    if (newEventKeys.length > 0) {
      const animationTimerId = window.setTimeout(() => {
        this.newTimelineEventKeys.set(new Set());
      }, 700);

      // Each update owns its timer so older updates cannot clear a newer animation.
      onCleanup(() => window.clearTimeout(animationTimerId));
    }
  });

  protected isNewTimelineItem(item: MatchTimelineItem): boolean {
    return item.type === 'event' && this.newTimelineEventKeys().has(item.key);
  }

  protected isSecondYellowCard(event: EventWithResult): boolean {
    return (
      event.type === 'Card' && event.comments === SECOND_YELLOW_CARD_COMMENT
    );
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
      event.comments,
    ].join('|');
  }

  private getShootoutResults(
    eventsDesc: EventWithResult[]
  ): Map<EventWithResult, EventWithResult['result']> {
    const resultMap = new Map<EventWithResult, EventWithResult['result']>();

    const shootoutEventsAsc = eventsDesc
      .filter((event) =>
        isPenaltyShootoutEvent(event, this.fixture()?.data.score.penalty)
      )
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
      isPenaltyShootoutEvent(event, this.fixture()?.data.score.penalty) &&
      event.type === 'Goal' &&
      event.detail !== 'Missed Penalty'
    );
  }

  private getTotalMinute(event: EventWithResult): number {
    return event.time.elapsed + (event.time.extra ?? 0);
  }
}
