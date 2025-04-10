import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'rs-event-var',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span:last-child { @apply text-rs-color-text-2 text-rs-font-size-small; }
  `,
  template: `
    @if (event(); as event) {
    <span>VAR</span>
    @switch(event.detail) { @case('Goal cancelled') {
    <span>Tor aberkannt </span>
    } @case("Penalty confirmed") {
    <span>Elfmeter bestätigt</span>
    } @case("Goal Disallowed - handball") {
    <span>Tor aberkannt - Handspiel</span>
    } @case("Goal Disallowed - offside") {
    <span>Tor aberkannt - Abseits</span>
    } } }
  `,
})
export class EventVarComponent {
  event = input.required<EventDTO>();
}
