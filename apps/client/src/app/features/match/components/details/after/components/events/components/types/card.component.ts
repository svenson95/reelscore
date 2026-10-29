import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { EventDTO } from '@reelscore-sdk/models';

import translations from '../../event-translations.json';
import { EventPlayerPhotoComponent } from '../event-player-photo.component';

@Component({
  selector: 'rs-event-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EventPlayerPhotoComponent],
  styles: `
    :host { @apply flex items-center gap-2; }
    :host-context(.is-home) { @apply flex-row-reverse; }
    .details { @apply flex min-w-0 flex-col; }
    :host-context(.is-home) .details { @apply text-right; }
    .player { @apply min-w-0; }
    .comment { @apply text-rs-font-size-small text-rs-color-text-2; }
  `,
  template: `
    @if (event(); as event) { @if (shouldShowPlayerPhoto(event)) {
    <rs-event-player-photo [playerId]="event.player.id" />
    }
    <div class="details">
      <span class="player">{{ event.player.name }}</span>
      @if (event.comments) {
      <span class="comment">{{ translateComment(event.comments) }}</span>
      }
    </div>
    }
  `,
})
export class EventCardComponent {
  event = input.required<EventDTO>();

  protected shouldShowPlayerPhoto(event: EventDTO): boolean {
    return event.player.id > 0 && event.detail === 'Red Card';
  }

  protected translateComment(comment: string): string {
    return (
      translations.cardComments[
        comment as keyof typeof translations.cardComments
      ] ?? comment
    );
  }
}
