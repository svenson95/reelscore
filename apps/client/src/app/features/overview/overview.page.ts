import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  type OnInit,
  signal,
  viewChild,
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

  private readonly overviewContent = viewChild(OverviewContentComponent);
  private readonly refreshService = inject(OverviewRefreshService);

  ngOnInit(): void {
    this.refreshService.init();
  }

  ngOnDestroy(): void {
    this.refreshService.destroy();
  }

  onRouteDetach(): void {
    this.animateNavigation.set(false);
    this.overviewContent()?.resetNavigationAnimation();
  }

  onRouteAttach(): void {
    this.animateNavigation.set(true);
  }
}
