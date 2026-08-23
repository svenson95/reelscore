import {
  type OnDestroy,
  type OnInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { DateBarComponent, OverviewContentComponent } from './components';
import { OverviewRefreshService, SERVICE_PROVIDERS } from './services';

@Component({
  selector: 'rs-overview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, OverviewContentComponent],
  providers: [...SERVICE_PROVIDERS],
  styles: `
    :host ::ng-deep h2 { margin-left: 1rem; }
    :host { @apply min-h-[70vh]; }
  `,
  template: `
    <nav
      aria-label="Date-Bar Navigation"
      rs-date-bar
      class="animate-drop-from-top"
    ></nav>

    <section rs-overview-content data-testid="overview-page"></section>
  `,
})
export class OverviewComponent implements OnInit, OnDestroy {
  private readonly refreshService = inject(OverviewRefreshService);

  ngOnInit(): void {
    this.refreshService.init();
  }

  ngOnDestroy(): void {
    this.refreshService.destroy();
  }
}
