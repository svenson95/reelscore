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
  EventSubstitutionComponent,
  EventVarComponent,
} from './types';

@Component({
  selector: 'rs-match-event',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EventGoalComponent,
    EventSubstitutionComponent,
    EventCardComponent,
    EventVarComponent,
  ],
  styles: `
    :host { @apply flex text-rs-font-size-body-2; }
    :host.is-home { @apply justify-end pl-4; }
    :host:not(.is-home) { @apply pr-4; }
  `,
  template: `
    @if (event(); as event) { @switch (event.type) { @case('Goal') {
    <rs-event-goal [event]="event" />
    } @case("subst") {
    <rs-event-substitution [event]="event" />
    } @case("Card") {
    <rs-event-card [event]="event" />
    } @case("Var") {
    <rs-event-var [event]="event" />
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
