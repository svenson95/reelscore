import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { EventDTO } from '@reelscore-sdk/models';

@Component({
  selector: 'rs-event-substitution',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply flex flex-col; }
    :host-context(.is-home) { @apply items-end text-right; }
    span:first-child { @apply text-rs-color-green; }
    span:last-child { @apply text-rs-color-red text-rs-font-size-small; }
    .substitution-player { @apply inline-flex; }
    .outgoing { @apply text-rs-color-red text-rs-font-size-small; }
  `,
  template: `
    @if (event(); as event) {
    <span class="substitution-player incoming">{{ event.assist.name }}</span>
    <span class="substitution-player outgoing">{{ event.player.name }}</span>
    }
  `,
})
export class EventSubstitutionComponent {
  event = input.required<EventDTO>();
}
