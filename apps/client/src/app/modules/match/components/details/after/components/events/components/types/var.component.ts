import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'reelscore-event-var',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span:last-child { @apply text-fb-color-text-2 text-fb-font-size-small; }
  `,
  template: `
    @if (event(); as event) {
    <span>VAR</span>
    @if (event.detail === 'Goal cancelled') {
    <span>Tor aberkannt</span>
    } @else if (event.detail === 'Penalty confirmed') {
    <span>Elfmeter bestätigt</span>
    } }
  `,
})
export class EventVarComponent {
  event = input.required<EventDTO>();
}
