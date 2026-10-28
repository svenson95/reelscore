import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { EventDTO } from '@reelscore-sdk/models';

import translations from '../../event-translations.json';

@Component({
  selector: 'rs-event-var',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span:last-child { @apply text-rs-color-text-2 text-rs-font-size-small; }
  `,
  template: `
    @if (event(); as event) {
    <span>VAR</span>
    <span>{{ translateDetail(event.detail) }}</span>
    }
  `,
})
export class EventVarComponent {
  event = input.required<EventDTO>();

  protected translateDetail(detail: string): string {
    return (
      translations.details[detail as keyof typeof translations.details] ??
      detail
    );
  }
}
