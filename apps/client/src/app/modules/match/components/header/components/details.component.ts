import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  EventDTO,
  EventResult,
  EventWithResult,
  FixtureDTO,
  FixtureHighlights,
  MatchTeams,
  timeTotal,
} from '@lib/models';

@Component({
  selector: 'reelscore-match-header-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col text-rs-font-size-small; }
    .event-row { @apply flex; }
    .team-column { @apply flex-1; }
    .result-column { @apply flex w-[50px] text-center items-center justify-center; }
    .event-time { @apply text-rs-color-text-2; }
    .team-column:first-of-type { @apply text-right; }
    .red-card { @apply bg-red-500 w-2 h-3 m-auto rounded-[2px]; }
  `,
  template: `
    @for (event of events(); track $index) {
    <div class="event-row">
      <div class="team-column">
        @if (isHomeEvent(event)) {
        <span class="event-player">{{ event.player.name }}</span>
        &nbsp;
        <span class="event-time">
          {{ event.time.elapsed + (event.time.extra ?? 0) }}'
        </span>
        }
      </div>
      <div class="result-column">
        @if (event.type === 'Goal') {
        {{ event.result.home }} - {{ event.result.away }} } @else {
        <div class="red-card"></div>
        }
      </div>
      <div class="team-column">
        @if (!isHomeEvent(event)) {
        <span class="event-time">
          {{ event.time.elapsed + (event.time.extra ?? 0) }}'
        </span>
        &nbsp;
        <span class="event-player">{{ event.player.name }}</span>
        }
      </div>
    </div>
    }
  `,
})
export class HeaderDetailsComponent {
  data = input.required<FixtureDTO>();
  highlights = input.required<FixtureHighlights>();

  events = computed(() => {
    return mappedEvents(this.highlights(), this.data().teams);
  });

  isHomeEvent = (event: EventDTO) =>
    event.team.id === this.data().teams.home.id;
}

// TODO refactor this functions copied from events.store.ts
const mappedEvents = (
  events: EventDTO[],
  teams: MatchTeams
): EventWithResult[] =>
  events.map((e) => ({
    ...e,
    result: getTeamGoals(events, e, teams),
  }));

const getTeamGoals = (
  events: EventDTO[],
  event: EventDTO,
  teams: MatchTeams
): EventResult => {
  if (teams === undefined) throw new Error('Teams not found in fixture');
  const goals = events.filter(
    (e) => e.type === 'Goal' && e.detail !== 'Missed Penalty'
  );
  const elapsed = goals.filter((e) => timeTotal(e) <= timeTotal(event));
  const home = elapsed.filter((e) => e.team.id === teams.home.id).length;
  const away = elapsed.filter((e) => e.team.id === teams.away.id).length;
  return { home, away };
};
