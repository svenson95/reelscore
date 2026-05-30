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
  type EventWithResult,
  type FixtureDTO,
  type FixtureHighlights,
  type Goals,
  type MatchTeams,
  timeTotal,
} from '@lib/models';

type HighlightSpacerType = 'halftime' | 'penalty-shootout';

type HighlightSpacer = {
  kind: 'spacer';
  type: HighlightSpacerType;
  label: string;
};

type HighlightEvent = EventWithResult & {
  kind: 'event';
};

type HighlightItem = HighlightEvent | HighlightSpacer;

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

    .highlight-spacer {
      @apply flex items-center gap-2 my-1 text-rs-color-text-2 px-12;
    }

    .highlight-spacer::before,
    .highlight-spacer::after {
      content: '';
      @apply h-px flex-1 bg-rs-border-color-1;
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
        @if (item.type === 'Goal') {
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
  data = input.required<FixtureDTO>();
  highlights = input.required<FixtureHighlights>();

  events = computed<HighlightItem[]>(() => {
    const highlights = untracked(this.highlights);
    const fixture = untracked(this.data);

    return mappedEventsWithSpacers(highlights, fixture);
  });

  private homeTeamId = computed(() => untracked(this.data).teams.home.id);

  asSpacer = (item: HighlightItem): HighlightSpacer | null =>
    item.kind === 'spacer' ? item : null;

  asEvent = (item: HighlightItem): HighlightEvent | null =>
    item.kind === 'event' ? item : null;

  isHomeEvent = (event: HighlightEvent): boolean =>
    event.team.id === this.homeTeamId();
}

const mappedEventsWithSpacers = (
  events: EventDTO[],
  fixture: FixtureDTO
): HighlightItem[] => {
  const mappedEvents = eventsWithResult(events, fixture.teams);
  const halftime = fixture.score.halftime;

  const result: HighlightItem[] = [];
  let hasHalftimeSpacer = false;
  let hasPenaltyShootoutSpacer = false;

  for (const event of mappedEvents) {
    if (!hasHalftimeSpacer && isSecondHalfEvent(event, halftime)) {
      result.push({
        kind: 'spacer',
        type: 'halftime',
        label: 'Halbzeit',
      });

      hasHalftimeSpacer = true;
    }

    if (!hasPenaltyShootoutSpacer && isPenaltyShootoutEvent(event)) {
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
};

const eventsWithResult = (
  events: EventDTO[],
  teams: MatchTeams
): HighlightEvent[] =>
  events.map((event) => ({
    ...event,
    kind: 'event',
    result: getTeamGoals(events, event, teams),
  }));

const isPossibleSecondHalfBoundaryEvent = (event: HighlightEvent): boolean =>
  event.type === 'Goal' && event.time.elapsed >= 35 && event.time.elapsed <= 50;

const isResultAfterHalftime = (
  result: EventResult,
  halftime: Goals
): boolean => {
  if (halftime.home === null || halftime.away === null) return false;

  return result.home > halftime.home || result.away > halftime.away;
};

const isSecondHalfEvent = (event: HighlightEvent, halftime: Goals): boolean => {
  if (isPenaltyShootoutEvent(event)) return false;

  if (event.time.elapsed > 45) return true;

  if (!isPossibleSecondHalfBoundaryEvent(event)) return false;

  return isResultAfterHalftime(event.result, halftime);
};

const isPenaltyShootoutEvent = (event: EventDTO): boolean =>
  event.time.elapsed >= 120 &&
  event.type === 'Goal' &&
  ['Penalty', 'Missed Penalty'].includes(event.detail);

const getTeamGoals = (
  events: EventDTO[],
  event: EventDTO,
  teams: MatchTeams
): EventResult => {
  if (teams === undefined) throw new Error('Teams not found in fixture');

  if (isPenaltyShootoutEvent(event)) {
    return getPenaltyShootoutGoals(events, event, teams);
  }

  return getRegularTeamGoals(events, event, teams);
};

const getRegularTeamGoals = (
  events: EventDTO[],
  event: EventDTO,
  teams: MatchTeams
): EventResult => {
  const goals = events.filter(
    (e) =>
      e.type === 'Goal' &&
      e.detail !== 'Missed Penalty' &&
      !isPenaltyShootoutEvent(e)
  );

  const elapsed = goals.filter((e) => timeTotal(e) <= timeTotal(event));

  const home = elapsed.filter((e) => e.team.id === teams.home.id).length;
  const away = elapsed.filter((e) => e.team.id === teams.away.id).length;

  return { home, away };
};

const getPenaltyShootoutGoals = (
  events: EventDTO[],
  event: EventDTO,
  teams: MatchTeams
): EventResult => {
  const penaltyGoals = events.filter(
    (e) =>
      isPenaltyShootoutEvent(e) &&
      e.detail !== 'Missed Penalty' &&
      timeTotal(e) <= timeTotal(event)
  );

  const home = penaltyGoals.filter((e) => e.team.id === teams.home.id).length;
  const away = penaltyGoals.filter((e) => e.team.id === teams.away.id).length;

  return { home, away };
};
