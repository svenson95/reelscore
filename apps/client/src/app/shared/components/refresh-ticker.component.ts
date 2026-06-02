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
  styles: `
    :host { @apply flex h-fit p-[0.38rem] bg-rs-color-primary border shadow-rs2 text-red-100; }
    mat-progress-spinner { --mdc-circular-progress-active-indicator-color: var(--rs-color-text-3); }
  `,
  template: `<mat-progress-spinner
    [value]="value()"
    diameter="22"
    strokeWidth="2.5"
    matTooltip="Nächste Aktualisierung"
  /> `,
})
export class RefreshTickerComponent {
  private readonly pageRefreshService = inject(PageRefreshService);
  readonly value = computed<number>(() => {
    return (this.pageRefreshService.timer() / REFRESH_INTERVAL_SECONDS) * 100;
  });
}
