import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'reelscore-event-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span:last-child { @apply text-fb-font-size-small text-fb-color-text-2; }
  `,
  template: `
    @if (event(); as event) {
    <span>{{ event.player.name }}</span>
    <span>{{ event.comments }}</span>
    }
  `,
})
export class EventCardComponent {
  event = input.required<EventDTO>();
}
