import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { StartupService } from './shared/services/startup/startup.service';

@Component({
  selector: 'rs-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
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
export class AppComponent {
  private readonly startupService = inject(StartupService);

  onRouteActivated(): void {
    if (this.startupService.routeActivated) {
      return;
    }

    this.startupService.routeActivated = true;
    this.startupService.hideAppInitializer();
  }
}
