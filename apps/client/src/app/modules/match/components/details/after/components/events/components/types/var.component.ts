import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventsResponse } from '@lib/models';

@Component({
  selector: 'futbet-event-var',
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
    <div>
      <!-- <span>{{ result() }}</span> -->
    </div>
    <div class="names">
      <span>{{ event.player.name }}</span>
    </div>
    }
  `,
})
export class EventVarComponent {
  event = input.required<EventsResponse>();
}
