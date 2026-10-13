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

import {
  LiveRefreshService,
  REFRESH_INTERVAL_SECONDS,
} from '../../data-access';

@Component({
  selector: 'button[rsRefreshTicker]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIcon],
  hostDirectives: [MatTooltip],
  host: {
    type: 'button',
    'aria-label': 'Status der Live-Aktualisierung anzeigen',
    '[class.is-active]': 'isActive()',
    '[class.is-reset]': 'isReset()',
    '[style.--refresh-progress]': 'progress()',
    '[attr.data-timer]': 'timer()',
    '(click)': 'showTooltip()',
    'data-testid': 'refresh-timer',
  },
  styles: `
    :host {
      @apply relative flex size-9 items-center justify-center overflow-hidden rounded-border2 shadow-rs3;
      padding: 0;
      border: 0;
      background-color: var(--rs-button-bg-color);
      color: var(--rs-border-color-2);
      cursor: pointer;
    }

    :host(:focus-visible) {
      outline: 2px solid var(--rs-color-primary);
      outline-offset: 2px;
    }

    mat-icon {
      position: relative;
      z-index: 1;

      $size: 10px;
      width: $size;
      height: $size;
      border-radius: 50%;
      background-color: currentColor;
      font-size: 0;
    }

    @property --refresh-progress {
      syntax: '<percentage>';
      inherits: true;
      initial-value: 0%;
    }

    :host::before {
      content: '';
      position: absolute;
      inset: 0;
      background: conic-gradient(
        var(--rs-color-primary) var(--refresh-progress),
        transparent 0
      );
      opacity: 0;
      pointer-events: none;

      transition: --refresh-progress 1s linear;
    }

    :host(.is-reset)::before {
      transition: none;
    }

    :host::after {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background-color: var(--rs-button-bg-color);
      pointer-events: none;
    }

    :host(.is-active)::before {
      opacity: 1;
    }

    :host(.is-active) {
      color: var(--rs-color-green);
    }

    :host(.is-active) mat-icon {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      50% {
        opacity: 0.45;
        transform: scale(0.75);
      }
    }

    ::ng-deep .refresh-tooltip {
      white-space: pre-line;
      text-align: center;
    }
  `,
  template: `<mat-icon aria-hidden="true" />`,
})
export class RefreshTickerComponent {
  readonly active = input<boolean>(true);

  private readonly liveRefreshService = inject(LiveRefreshService);
  private readonly tooltip = inject(MatTooltip);

  protected readonly timer = this.liveRefreshService.timer;

  protected readonly isActive = computed<boolean>(
    () => this.active() && this.liveRefreshService.isRunning()
  );

  protected readonly progress = computed<string>(() => {
    const elapsedSeconds = REFRESH_INTERVAL_SECONDS - this.timer();
    const progress = (elapsedSeconds / REFRESH_INTERVAL_SECONDS) * 100;

    return `${Math.round(progress)}%`;
  });

  protected readonly isReset = computed<boolean>(
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

  protected showTooltip(): void {
    this.tooltip.show();
    this.tooltip.hide(2500);
  }
}
