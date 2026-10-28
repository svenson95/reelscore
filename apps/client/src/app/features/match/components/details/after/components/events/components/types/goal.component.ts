import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { EventDTO } from '@reelscore-sdk/models';

import { EventPlayerPhotoComponent } from '../event-player-photo.component';

@Component({
  selector: 'rs-event-goal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EventPlayerPhotoComponent],
  styles: `
      :host { @apply flex w-full min-w-0 pb-1; }
      .goal-content { @apply flex w-full min-w-0 items-center gap-2; }
      :host-context(.is-home) .goal-content { @apply flex-row-reverse; }
      .details { @apply flex min-w-0 flex-1 flex-col; }
      :host-context(.is-home) .details { @apply text-right; }
      .player { @apply flex min-h-6 min-w-0 items-center; }
      :host-context(.is-home) .player { @apply justify-end; }
      .bottom { @apply flex text-rs-font-size-small text-rs-color-text-2; }
      :host-context(.is-home) .bottom { @apply justify-end; }
      .assist { @apply flex-wrap; }
    `,
  template: `
    @if (event(); as event) {
    <div class="goal-content">
      @if (event.player.id > 0) {
      <rs-event-player-photo [playerId]="event.player.id" />
      }
      <div class="details">
        <span class="player">{{ event.player.name }}</span>
        @if (event.assist.id && event.assist.id !== event.player.id) {
        <span class="bottom assist">Vorlage: {{ event.assist.name }}</span>
        } @else if(event.detail === 'Penalty') {
        <span class="bottom">Elfmeter</span>
        } @else if (event.detail === 'Missed Penalty') {
        <span class="bottom">Verschossener Elfmeter</span>
        }
      </div>
    </div>
    }
  `,
})
export class EventGoalComponent {
  event = input.required<EventDTO>();
}
