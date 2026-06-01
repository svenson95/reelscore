import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  untracked,
} from '@angular/core';

import {
  type EventDTO,
  type EventResult,
  type FixtureDTO,
  type FixtureHighlights,
  type Goals,
  type HighlightEvent,
  type HighlightItem,
  type MatchTeams,
  type TeamId,
  timeTotal,
} from '@lib/models';

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
      @apply flex-1;
    }

    .result-column {
      @apply flex w-[50px] text-center items-center justify-center;
    }

    .event-time {
      @apply text-rs-color-text-2;
    }

    .team-column:first-of-type {
      @apply text-right;
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
      @apply text-[0.65rem] uppercase tracking-wide;
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
        &nbsp;
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
        &nbsp;
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

  readonly events = computed<HighlightItem[]>(() => {
    const highlights = untracked(this.highlights);
    const fixture = untracked(this.data);

    return this.mappedEventsWithSpacers(highlights, fixture);
  });

  private readonly homeTeamId = computed<TeamId>(
    () => untracked(this.data).teams.home.id
  );

  isHomeEvent = (event: HighlightEvent): boolean =>
    event.team.id === this.homeTeamId();

  isMissedPenalty = (event: HighlightEvent): boolean =>
    event.type === 'Goal' && event.detail === 'Missed Penalty';

  private hasFirstHalfEvents(events: EventDTO[]): boolean {
    return events.some(
      (e) => e.time.elapsed <= 45 && !this.isPenaltyShootoutEvent(e)
    );
  }

  private mappedEventsWithSpacers(
    events: EventDTO[],
    fixture: FixtureDTO
  ): HighlightItem[] {
    const mappedEvents = this.eventsWithResult(events, fixture.teams);
    const halftime = fixture.score.halftime;

    const hasFirstHalfEvents = this.hasFirstHalfEvents(mappedEvents);

    const result: HighlightItem[] = [];
    let hasHalftimeSpacer = false;
    let hasPenaltyShootoutSpacer = false;

    for (const event of mappedEvents) {
      if (
        hasFirstHalfEvents &&
        !hasHalftimeSpacer &&
        this.isSecondHalfEvent(event, halftime)
      ) {
        result.push({
          kind: 'spacer',
          type: 'halftime',
          label: 'Halbzeit',
        });

        hasHalftimeSpacer = true;
      }

      if (!hasPenaltyShootoutSpacer && this.isPenaltyShootoutEvent(event)) {
        result.push({
          kind: 'spacer',
          type: 'penalty-shootout',
          label: 'Elfmeterschießen',
        });

        hasPenaltyShootoutSpacer = true;
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

  private isPossibleSecondHalfBoundaryEvent(event: HighlightEvent): boolean {
    return (
      event.type === 'Goal' &&
      event.time.elapsed >= 35 &&
      event.time.elapsed <= 50
    );
  }

  private isResultAfterHalftime(result: EventResult, halftime: Goals): boolean {
    if (halftime.home === null || halftime.away === null) return false;

    return result.home > halftime.home || result.away > halftime.away;
  }

  private isSecondHalfEvent(event: HighlightEvent, halftime: Goals): boolean {
    if (this.isPenaltyShootoutEvent(event)) return false;

    if (event.time.elapsed > 45) return true;

    if (!this.isPossibleSecondHalfBoundaryEvent(event)) return false;

    return this.isResultAfterHalftime(event.result, halftime);
  }

  private isPenaltyShootoutEvent(event: EventDTO): boolean {
    return (
      event.time.elapsed >= 120 &&
      event.type === 'Goal' &&
      ['Penalty', 'Missed Penalty'].includes(event.detail)
    );
  }

  private getTeamGoals(
    events: EventDTO[],
    event: EventDTO,
    teams: MatchTeams,
    eventIndex: number
  ): EventResult {
    if (teams === undefined) throw new Error('Teams not found in fixture');

    if (this.isPenaltyShootoutEvent(event)) {
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
        !this.isPenaltyShootoutEvent(e)
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
          this.isPenaltyShootoutEvent(event) &&
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
