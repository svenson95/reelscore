import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { PageRefreshService, REFRESH_INTERVAL_SECONDS } from '../services';

@Component({
  selector: 'rs-refresh-ticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIcon],
  styles: `
    :host {
      @apply flex;
    }

    $buttonBg: var(--rs-color-text-3);

    button {
      position: relative;
      overflow: hidden;
      background-color: var(--rs-color-primary);
    }

    button::before {
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

    button::after {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      pointer-events: none;
      background-color: $buttonBg;
    }

    mat-icon {
      position: relative;
      z-index: 1;
      --mat-icon-color: var(--rs-border-color-2);
    }

    :host(.is-active) button::before {
      opacity: 1;
      animation: refresh-progress ${REFRESH_INTERVAL_SECONDS}s linear infinite;
    }

    :host(.is-active) mat-icon {
      --mat-icon-color: var(--rs-color-primary);
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
  host: {
    '[class.is-active]': 'isActive()',
  },
  template: `
    <button
      mat-icon-button
      [disabled]="buttonDisabled()"
      (click)="refresh($event)"
    >
      <mat-icon fontIcon="refresh" />
    </button>
  `,
})
export class RefreshTickerComponent {
  private readonly pageRefreshService = inject(PageRefreshService);

  readonly isActive = this.pageRefreshService.isRunning;

  readonly buttonDisabled = computed<boolean>(() => {
    const BUTTON_DELAY = REFRESH_INTERVAL_SECONDS - 3;
    return !this.isActive() || this.pageRefreshService.timer() > BUTTON_DELAY;
  });

  refresh(event: Event): void {
    event.preventDefault();
    void this.pageRefreshService.refresh();
  }
}
