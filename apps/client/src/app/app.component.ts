import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

// TODO: refactor week store to core (1)
import { OVERVIEW_WEEK_STORE_PROVIDERS } from './features/overview/stores';

import {
  FooterComponent,
  HeaderComponent,
  RealtimeUpdateService,
} from './core';
import {
  RealtimeService,
  StartupService,
  VisibilityObserverService,
} from './shared';

@Component({
  selector: 'rs-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  providers: [...OVERVIEW_WEEK_STORE_PROVIDERS, RealtimeUpdateService],
  styles: `
    :host {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `,
  template: `
    <header rs-header-content></header>

    <main>
      <router-outlet (activate)="onRouteActivated()" />
    </main>

    <footer rs-footer-content></footer>
  `,
})
export class AppComponent implements OnInit {
  private readonly startupService = inject(StartupService);
  private readonly visibilityObserverService = inject(
    VisibilityObserverService
  );
  private readonly realtimeService = inject(RealtimeService);
  private readonly realtimeUpdateService = inject(RealtimeUpdateService);

  ngOnInit(): void {
    this.realtimeUpdateService.init();
    this.realtimeService.connect();
    this.visibilityObserverService.init();
  }

  onRouteActivated(): void {
    if (this.startupService.routeActivated) {
      return;
    }

    this.startupService.routeActivated = true;
    this.startupService.hideAppInitializer();
  }
}
