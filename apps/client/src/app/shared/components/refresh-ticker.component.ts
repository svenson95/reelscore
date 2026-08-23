import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { LiveRefreshService, REFRESH_INTERVAL_SECONDS } from '../services';

@Component({
  selector: 'rs-refresh-ticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIcon],
  host: {
    '[class.is-active]': 'isActive()',
    '[class.is-reset]': 'isReset()',
    '[style.--refresh-progress]': 'progress()',
    '[attr.data-timer]': 'timer()',
    'data-testid': 'refresh-timer',
  },
  styles: `
    :host {
      @apply flex;
    }

    $tickerBg: var(--rs-button-bg-color);

    .ticker {
      @apply relative flex size-9 items-center justify-center overflow-hidden rounded-border2;
      background-color: $tickerBg;
    }

    mat-icon {
      position: relative;
      z-index: 1;

      --mat-icon-color: var(--rs-border-color-2);

      $size: 20px;
      font-size: $size;
      width: $size;
      height: $size;
    }

    @property --refresh-progress {
      syntax: '<percentage>';
      inherits: true;
      initial-value: 0%;
    }

    .ticker::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: conic-gradient(
        var(--rs-color-primary) var(--refresh-progress),
        transparent 0
      );
      opacity: 0;
      pointer-events: none;

      transition: --refresh-progress 1s linear;
    }

    :host(.is-reset) .ticker::before {
      transition: none;
    }

    .ticker::after {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background-color: $tickerBg;
      pointer-events: none;
    }

    :host(.is-active) .ticker::before {
      opacity: 1;
    }

    :host(.is-active) mat-icon {
      --mat-icon-color: var(--rs-color-primary);
      transition: color 150ms ease-in-out;
    }
  `,
  template: `
    <span class="ticker" aria-hidden="true">
      <mat-icon fontIcon="refresh" />
    </span>
  `,
})
export class RefreshTickerComponent {
  private readonly liveRefreshService = inject(LiveRefreshService);

  readonly timer = this.liveRefreshService.timer;
  readonly isActive = this.liveRefreshService.isRunning;

  readonly progress = computed<string>(() => {
    const elapsedSeconds = REFRESH_INTERVAL_SECONDS - this.timer();
    const progress = (elapsedSeconds / REFRESH_INTERVAL_SECONDS) * 100;

    return `${Math.round(progress)}%`;
  });

  readonly isReset = computed<boolean>(
    () => this.timer() === REFRESH_INTERVAL_SECONDS
  );
}
