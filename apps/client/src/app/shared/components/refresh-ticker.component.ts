import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';

import { PageRefreshService, REFRESH_INTERVAL_SECONDS } from '../services';

@Component({
  selector: 'rs-refresh-ticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinner, MatTooltip],
  host: {
    '[class.is-active]': 'isActive()',
  },
  styles: `
    :host { @apply flex h-fit p-[0.375rem] border shadow-rs2; }

    :host-context(.is-active) { @apply bg-rs-color-primary; }
    :host-context:not(.is-active) { @apply bg-[var(--rs-button-bg-color)]; }

    :host-context(.is-active) mat-progress-spinner {
      --mat-progress-spinner-active-indicator-color: var(--rs-color-text-3);
    }
    :host-context:not(.is-active) mat-progress-spinner {
      --mat-progress-spinner-active-indicator-color: var(--rs-border-color-2);
    }
  `,
  template: `<mat-progress-spinner
    [value]="value()"
    diameter="22"
    strokeWidth="2.5"
    [matTooltip]="
      isActive() ? 'Automatische Updates aktiv' : 'Automatische Updates inaktiv'
    "
    #tooltip="matTooltip"
    (click)="tooltip.toggle()"
  /> `,
})
export class RefreshTickerComponent {
  private readonly pageRefreshService = inject(PageRefreshService);

  readonly isActive = this.pageRefreshService.isRunning;

  readonly value = computed<number>(() => {
    return (this.pageRefreshService.timer() / REFRESH_INTERVAL_SECONDS) * 100;
  });
}
