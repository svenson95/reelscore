import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'reelscore-event-substitution',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span:first-child { @apply text-green-800; }
    span:last-child { @apply text-red-800 text-rs-font-size-small; }
  `,
  template: `
    @if (event(); as event) {
    <span>{{ event.player.name }}</span>
    <span>{{ event.assist.name }}</span>
    }
  `,
})
export class EventSubstitutionComponent {
  event = input.required<EventDTO>();
}
