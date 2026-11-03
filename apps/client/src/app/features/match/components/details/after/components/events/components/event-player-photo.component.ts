import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const PLAYER_IMAGE_BASE_URL = 'https://media.api-sports.io/football/players/';

@Component({
  selector: 'rs-event-player-photo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply inline-flex shrink-0; }
    .event-player-photo-frame { @apply h-[30px] w-[30px]; }

    img {
      @apply h-full w-full rounded-full bg-rs-alt-bg object-cover object-top;
    }
  `,
  template: `
    @if (playerId() > 0) {
    <span class="rs-photo-frame event-player-photo-frame">
      <img
        [src]="PLAYER_IMAGE_BASE_URL + playerId() + '.png'"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
    </span>
    }
  `,
})
export class EventPlayerPhotoComponent {
  protected readonly PLAYER_IMAGE_BASE_URL = PLAYER_IMAGE_BASE_URL;
  readonly playerId = input.required<number>();
}
