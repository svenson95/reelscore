import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { timeTotal } from '@reelscore-sdk/helpers';
import type {
  EventDTO,
  EventResult,
  FixtureDTO,
  FixtureHighlights,
  HighlightEvent,
  HighlightItem,
  MatchTeams,
  TeamId,
} from '@reelscore-sdk/models';

import {
  hasFirstHalfEvents,
  isExtraTimeEvent,
  isPenaltyShootoutEvent,
  isSecondHalfEvent,
} from '../../../utils/event-timeline.helper';

type MatchHighlightItem =
  | HighlightItem
  | { kind: 'spacer'; type: 'extra-time'; label: string };

@Component({
  selector: 'rs-match-highlights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col text-rs-font-size-small; }

    .event-row {
      @apply flex;
    }

    .team-column {
      @apply flex min-w-0 flex-1 items-center gap-2 overflow-hidden;
    }

    .result-column {
      @apply flex w-[50px] text-center items-center justify-center;
    }

    .event-time {
      @apply shrink-0 text-rs-color-text-2;
    }

    .event-player {
      @apply min-w-0 overflow-hidden text-ellipsis whitespace-nowrap;
    }

    .team-column:first-of-type {
      @apply justify-end text-right;
    }

    .red-card {
      @apply bg-rs-color-red w-2 h-3 m-auto rounded-[2px];
    }

    .missed-penalty {
      @apply font-bold;
    }

    .highlight-spacer {
      @apply flex items-center gap-2 my-1 text-rs-color-text-2 px-12;
    }

    .highlight-spacer::before,
    .highlight-spacer::after {
      content: '';
      @apply h-px flex-1 bg-rs-border-color-2;
    }

    .highlight-spacer-label {
      @apply text-rs-font-size-small uppercase tracking-wide;
    }
  `,
  template: `
    @for (item of events(); track $index) { @if (item.kind === 'spacer') {
    <div class="highlight-spacer">
      <span class="highlight-spacer-label">{{ item.label }}</span>
    </div>
    } @else {
    <div class="event-row">
      <div class="team-column">
        @if (isHomeEvent(item)) {
        <span class="event-player">{{ item.player.name }}</span>
        <span class="event-time">
          {{ item.time.elapsed + (item.time.extra ?? 0) }}'
        </span>
        }
      </div>

      <div class="result-column">
        @if (isMissedPenalty(item)) {
        <span class="missed-penalty">×</span>
        } @else if (item.type === 'Goal') {
        {{ item.result.home }} - {{ item.result.away }}
        } @else {
        <div class="red-card"></div>
        }
      </div>

      <div class="team-column">
        @if (!isHomeEvent(item)) {
        <span class="event-time">
          {{ item.time.elapsed + (item.time.extra ?? 0) }}'
        </span>
        <span class="event-player">{{ item.player.name }}</span>
        }
      </div>
    </div>
    } }
  `,
})
export class MatchHighlightsComponent {
  readonly data = input.required<FixtureDTO>();
  readonly highlights = input.required<FixtureHighlights>();

  readonly events = computed<MatchHighlightItem[]>(() => {
    const highlights = this.highlights();
    const fixture = this.data();

    return this.mappedEventsWithSpacers(highlights, fixture);
  });

  private readonly homeTeamId = computed<TeamId>(
    () => this.data().teams.home.id
  );

  isHomeEvent = (event: HighlightEvent): boolean =>
    event.team.id === this.homeTeamId();

  isMissedPenalty = (event: HighlightEvent): boolean =>
    event.type === 'Goal' && event.detail === 'Missed Penalty';

  private mappedEventsWithSpacers(
    events: EventDTO[],
    fixture: FixtureDTO
  ): MatchHighlightItem[] {
    const mappedEvents = this.eventsWithResult(events, fixture.teams);
    const halftime = fixture.score.halftime;
    const extraTimeScore = fixture.score.extratime;
    const penaltyScore = fixture.score.penalty;

    const hasFirstHalf = hasFirstHalfEvents(mappedEvents, penaltyScore);

    const result: MatchHighlightItem[] = [];
    let hasHalftimeSpacer = false;
    let hasPenaltyShootoutSpacer = false;
    let hasExtraTimeSpacer = false;

    for (const event of mappedEvents) {
      if (
        hasFirstHalf &&
        !hasHalftimeSpacer &&
        isSecondHalfEvent(event, halftime, penaltyScore)
      ) {
        result.push({
          kind: 'spacer',
          type: 'halftime',
          label: 'Halbzeit',
        });

        hasHalftimeSpacer = true;
      }

      if (
        !hasPenaltyShootoutSpacer &&
        isPenaltyShootoutEvent(event, penaltyScore)
      ) {
        result.push({
          kind: 'spacer',
          type: 'penalty-shootout',
          label: 'Elfmeterschießen',
        });

        hasPenaltyShootoutSpacer = true;
      }

      if (
        isExtraTimeEvent(event, extraTimeScore, penaltyScore) &&
        !hasExtraTimeSpacer
      ) {
        result.push({
          kind: 'spacer',
          type: 'extra-time',
          label: 'Verlängerung',
        });
        hasExtraTimeSpacer = true;
      }

      result.push(event);
    }

    return result;
  }

  private eventsWithResult(
    events: EventDTO[],
    teams: MatchTeams
  ): HighlightEvent[] {
    return events.map((event, index) => ({
      ...event,
      kind: 'event',
      result: this.getTeamGoals(events, event, teams, index),
    }));
  }

  private getTeamGoals(
    events: EventDTO[],
    event: EventDTO,
    teams: MatchTeams,
    eventIndex: number
  ): EventResult {
    if (teams === undefined) throw new Error('Teams not found in fixture');

    if (isPenaltyShootoutEvent(event, this.data().score.penalty)) {
      return this.getPenaltyShootoutGoals(events, eventIndex, teams);
    }

    return this.getRegularTeamGoals(events, event, teams);
  }

  private getRegularTeamGoals(
    events: EventDTO[],
    event: EventDTO,
    teams: MatchTeams
  ): EventResult {
    const goals = events.filter(
      (e) =>
        e.type === 'Goal' &&
        e.detail !== 'Missed Penalty' &&
        !isPenaltyShootoutEvent(e, this.data().score.penalty)
    );

    const elapsed = goals.filter((e) => timeTotal(e) <= timeTotal(event));

    const home = elapsed.filter((e) => e.team.id === teams.home.id).length;
    const away = elapsed.filter((e) => e.team.id === teams.away.id).length;

    return { home, away };
  }

  private getPenaltyShootoutGoals(
    events: EventDTO[],
    eventIndex: number,
    teams: MatchTeams
  ): EventResult {
    const penaltyGoals = events
      .slice(0, eventIndex + 1)
      .filter(
        (event) =>
          isPenaltyShootoutEvent(event, this.data().score.penalty) &&
          event.detail !== 'Missed Penalty'
      );

    const home = penaltyGoals.filter(
      (event) => event.team.id === teams.home.id
    ).length;

    const away = penaltyGoals.filter(
      (event) => event.team.id === teams.away.id
    ).length;

    return { home, away };
  }
}
