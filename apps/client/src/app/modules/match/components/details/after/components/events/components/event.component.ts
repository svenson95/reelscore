import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  input,
} from '@angular/core';

import {
  EventAssist,
  EventDetail,
  EventPlayer,
  EventTeam,
  EventTime,
  EventType,
  EventsResponse,
} from '@lib/models';
import {
  EventCardComponent,
  EventGoalComponent,
  EventSubstComponent,
  EventVarComponent,
} from './types';

export interface EventWithResult extends EventsResponse {
  result: { home: number; away: number };
}

class GoalEvent implements EventWithResult {
  time: EventTime;
  team: EventTeam;
  player: EventPlayer;
  assist: EventAssist;
  type: EventType;
  detail: EventDetail;
  comments: string;
  result: { home: number; away: number };

  constructor(
    goals: EventsResponse[],
    event: EventsResponse,
    homeTeamId: number
  ) {
    this.time = event.time;
    this.team = event.team;
    this.player = event.player;
    this.assist = event.assist;
    this.type = event.type;
    this.detail = event.detail;
    this.comments = event.comments;
    this.result = this.calculateGoals(goals, homeTeamId);
  }

  private calculateGoals(goals: EventsResponse[], homeTeamId: number) {
    const home = goals.filter((e) => e.team.id === homeTeamId).length;
    const away = goals.length - home;
    return { home, away };
  }
}

@Component({
  selector: 'futbet-match-event',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EventGoalComponent,
    EventSubstComponent,
    EventCardComponent,
    EventVarComponent,
  ],
  styles: `
    :host { @apply flex text-fb-font-size-body-2; }
    :host.is-home { @apply justify-end pl-4; }
    :host:not(.is-home) { @apply pr-4; }
  `,
  template: `
    @if (event(); as event) { @switch (event.type) { @case('Goal') {
    <futbet-event-goal [event]="goalEvent()" />
    } @case("subst") {
    <futbet-event-subst [event]="event" />
    } @case("Card") {
    <futbet-event-card [event]="event" />
    } @case("Var") {
    <futbet-event-var [event]="event" />
    }} }
  `,
})
export class MatchEventComponent {
  goals = input.required<EventsResponse[]>();
  event = input.required<EventsResponse>();
  homeTeamId = input.required<number>();
  awayTeamId = input.required<number>();

  goalEvent = computed(() => {
    const event = this.event();
    const goals = this.goals().filter(
      (e) => e.time.elapsed < event.time.elapsed
    );
    return new GoalEvent([...goals, event], event, this.homeTeamId());
  });

  @HostBinding('class.is-home')
  get isHome() {
    return this.event().team.id === this.homeTeamId();
  }
}
