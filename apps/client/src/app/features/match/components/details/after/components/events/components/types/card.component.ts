import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { EventDTO } from '@reelscore-sdk/models';

import translations from '../../event-translations.json';

@Component({
  selector: 'rs-event-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span:last-child { @apply text-rs-font-size-small text-rs-color-text-2; }
  `,
  template: `
    @if (event(); as event) {
    <span>{{ event.player.name }}</span>
    @if (event.comments) {
    <span>&nbsp;{{ translateComment(event.comments) }}</span>
    } }
  `,
})
export class EventCardComponent {
  event = input.required<EventDTO>();

  protected translateComment(comment: string): string {
    return (
      translations.cardComments[
        comment as keyof typeof translations.cardComments
      ] ?? comment
    );
  }
}
