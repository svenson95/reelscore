import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const PLAYER_IMAGE_BASE_URL = 'https://media.api-sports.io/football/players/';

@Component({
  selector: 'rs-event-player-photo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply inline-flex shrink-0; }
    img { @apply h-6 w-6 rounded-full bg-rs-alt-bg object-cover object-top shadow-rs; }
  `,
  template: `
    @if (playerId() > 0) {
    <img
      [src]="PLAYER_IMAGE_BASE_URL + playerId() + '.png'"
      alt=""
      aria-hidden="true"
      loading="lazy"
    />
    }
  `,
})
export class EventPlayerPhotoComponent {
  protected readonly PLAYER_IMAGE_BASE_URL = PLAYER_IMAGE_BASE_URL;
  readonly playerId = input.required<number>();
}
