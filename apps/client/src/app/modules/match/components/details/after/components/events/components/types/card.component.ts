import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'futbet-event-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
      :host { @apply flex gap-5; }
      .names { @apply flex flex-col; }
      .names div { @apply text-fb-font-size-small; }
    `,
  template: `
    @if (event(); as event) {
    <div class="names">
      <span>{{ event.player.name }}</span>
    </div>
    }
  `,
})
export class EventCardComponent {
  event = input.required<EventDTO>();
}
