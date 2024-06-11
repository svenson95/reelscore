import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'futbet-event-subst',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
      :host { @apply flex gap-5; }
      .names { 
        @apply flex flex-col; 

        span:first-child { @apply text-green-800; }
        span:last-child { @apply text-red-800 text-fb-font-size-small; }
      }
    `,
  template: `
    @if (event(); as event) {
    <!-- <div> -->
    <!-- <span>{{ result() }}</span> -->
    <!-- </div> -->
    <div class="names">
      <span>{{ event.assist.name }}</span>
      <span>{{ event.player.name }}</span>
    </div>
    }
  `,
})
export class EventSubstComponent {
  event = input.required<EventDTO>();
}
