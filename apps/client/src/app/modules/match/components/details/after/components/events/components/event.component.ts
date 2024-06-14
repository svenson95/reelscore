import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';

import { EventDTO } from '@lib/models';
import {
  EventCardComponent,
  EventGoalComponent,
  EventSubstComponent,
  EventVarComponent,
} from './types';

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
    <futbet-event-goal [event]="event" />
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
  event = input.required<EventDTO>();
  homeTeamId = input.required<number>();

  @HostBinding('class.is-home')
  get isHome() {
    return this.event().team.id === this.homeTeamId();
  }
}
