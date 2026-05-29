import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'rs-event-substitution',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span:first-child { @apply text-rs-color-green; }
    span:last-child { @apply text-rs-color-red text-rs-font-size-small; }
  `,
  template: `
    @if (event(); as event) {
    <span>{{ event.assist.name }}</span>
    <span>{{ event.player.name }}</span>
    }
  `,
})
export class EventSubstitutionComponent {
  event = input.required<EventDTO>();
}
