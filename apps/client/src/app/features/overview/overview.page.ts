import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';

import type { RouteReuseLifecycle } from '../../config';

import { DateBarComponent, OverviewContentComponent } from './components';
import {
  OVERVIEW_SERVICE_PROVIDERS,
  OverviewRefreshService,
} from './data-access';

@Component({
  selector: 'rs-overview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, OverviewContentComponent],
  providers: [...OVERVIEW_SERVICE_PROVIDERS],
  styles: `
    :host ::ng-deep h2 { margin-left: 1rem; }
    :host { @apply min-h-[70vh]; }
  `,
  template: `
    <nav
      aria-label="Date-Bar Navigation"
      rs-date-bar
      [class.animate-drop-from-top]="animateNavigation()"
    ></nav>

    <section rs-overview-content data-testid="overview-page"></section>
  `,
})
export class OverviewPage implements OnInit, OnDestroy, RouteReuseLifecycle {
  readonly animateNavigation = signal<boolean>(true);

  private readonly refreshService = inject(OverviewRefreshService);

  ngOnInit(): void {
    this.refreshService.init();
  }

  ngOnDestroy(): void {
    this.refreshService.destroy();
  }

  onRouteDetach(): void {
    this.animateNavigation.set(false);
  }
}
