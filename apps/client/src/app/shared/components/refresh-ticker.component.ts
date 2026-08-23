import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { PageRefreshService, REFRESH_INTERVAL_SECONDS } from '../services';

@Component({
  selector: 'rs-refresh-ticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIcon],
  host: {
    '[class.is-active]': 'isActive()',
    '[style.--refresh-progress-offset]': 'animationOffset()',
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

    .ticker::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: conic-gradient(
        var(--rs-color-primary) var(--progress),
        transparent 0
      );
      opacity: 0;
      pointer-events: none;
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

      animation: refresh-progress
        ${REFRESH_INTERVAL_SECONDS}s
        linear
        infinite;

      animation-delay: var(--refresh-progress-offset);
    }

    :host(.is-active) mat-icon {
      --mat-icon-color: var(--rs-color-primary);
      transition: color 150ms ease-in-out;
    }

    @property --progress {
      syntax: '<percentage>';
      inherits: false;
      initial-value: 0%;
    }

    @keyframes refresh-progress {
      from {
        --progress: 0%;
      }

      to {
        --progress: 100%;
      }
    }
  `,
  template: `
    <span class="ticker" aria-hidden="true">
      <mat-icon fontIcon="refresh" />
    </span>
  `,
})
export class RefreshTickerComponent {
  private readonly pageRefreshService = inject(PageRefreshService);

  readonly timer = this.pageRefreshService.timer;
  readonly isActive = this.pageRefreshService.isRunning;

  readonly animationOffset = signal('0s');

  private readonly animationStateEffect = effect(() => {
    if (!this.isActive()) {
      return;
    }

    const remainingSeconds = untracked(this.timer);
    const elapsedSeconds = REFRESH_INTERVAL_SECONDS - remainingSeconds;

    this.animationOffset.set(`-${elapsedSeconds}s`);
  });
}
