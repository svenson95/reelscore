import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { EventDTO } from '@reelscore-sdk/models';

import { EventPlayerPhotoComponent } from '../event-player-photo.component';

@Component({
  selector: 'rs-event-goal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EventPlayerPhotoComponent],
  styles: `
      :host { @apply flex w-full min-w-0 pb-1; }
      .goal-content { @apply flex w-full min-w-0 flex-col gap-0.5; }
      .scorer-row { @apply flex w-full min-w-0 items-center gap-2; }
      :host-context(.is-home) .scorer-row { @apply flex-row-reverse; }
      .player { @apply min-w-0 flex-1 leading-tight; }
      :host-context(.is-home) .player { @apply text-right; }
      .bottom { @apply flex w-full text-rs-font-size-small text-rs-color-text-2; }
      :host-context(.is-home) .bottom { @apply justify-end text-right; }
      .assist { @apply flex-wrap; }
    `,
  template: `
    @if (event(); as event) {
    <div class="goal-content">
      <div class="scorer-row">
        @if (event.player.id > 0) {
        <rs-event-player-photo [playerId]="event.player.id" />
        }
        <span class="player">{{ event.player.name }}</span>
      </div>
      @if (event.assist.id && event.assist.id !== event.player.id) {
      <span class="bottom assist">Vorlage: {{ event.assist.name }}</span>
      } @else if(!isPenaltyShootout() && event.detail === 'Penalty') {
      <span class="bottom">Elfmeter</span>
      } @else if (!isPenaltyShootout() && event.detail === 'Missed Penalty') {
      <span class="bottom">Verschossener Elfmeter</span>
      }
    </div>
    }
  `,
})
export class EventGoalComponent {
  event = input.required<EventDTO>();
  isPenaltyShootout = input<boolean>(false);
}
