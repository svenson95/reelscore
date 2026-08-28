import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { LiveRefreshService, REFRESH_INTERVAL_SECONDS } from '../services';

@Component({
  selector: 'rs-refresh-ticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIcon],
  hostDirectives: [MatTooltip],
  host: {
    '[class.is-active]': 'isActive()',
    '[class.is-reset]': 'isReset()',
    '[style.--refresh-progress]': 'progress()',
    '[attr.data-timer]': 'timer()',
    '(pointerup)': 'onPointerUp($event)',
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

    ::ng-deep .refresh-tooltip {
      white-space: pre-line;
      text-align: center;
    }
  `,
  template: `
    <span class="ticker" aria-hidden="true">
      <mat-icon fontIcon="refresh" />
    </span>
  `,
})
export class RefreshTickerComponent {
  readonly active = input<boolean>(true);

  private readonly liveRefreshService = inject(LiveRefreshService);
  private readonly tooltip = inject(MatTooltip);

  readonly timer = this.liveRefreshService.timer;

  readonly isActive = computed<boolean>(
    () => this.active() && this.liveRefreshService.isRunning()
  );

  readonly progress = computed<string>(() => {
    const elapsedSeconds = REFRESH_INTERVAL_SECONDS - this.timer();
    const progress = (elapsedSeconds / REFRESH_INTERVAL_SECONDS) * 100;

    return `${Math.round(progress)}%`;
  });

  readonly isReset = computed<boolean>(
    () => this.timer() === REFRESH_INTERVAL_SECONDS
  );

  private readonly tooltipMessage = effect(() => {
    this.tooltip.message = this.isActive()
      ? 'Live-Aktualisierung läuft\nLive-Spiele verfügbar'
      : 'Live-Aktualisierung aus\nKeine Live-Spiele verfügbar';
  });

  private readonly tooltipConfig = (() => {
    this.tooltip.tooltipClass = 'refresh-tooltip';
  })();

  onPointerUp(event: PointerEvent): void {
    if (event.pointerType !== 'touch') {
      return;
    }

    this.tooltip.show();
    this.tooltip.hide(2000);
  }
}
