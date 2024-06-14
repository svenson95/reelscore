import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'futbet-event-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span { @apply text-fb-font-size-small; }
  `,
  template: `
    @if (event(); as event) {
    <span>{{ event.player.name }}</span>
    }
  `,
})
export class EventCardComponent {
  event = input.required<EventDTO>();
}
