import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

const APP_INITIALIZER_FADE_DURATION_MS = 300;
const APP_INITIALIZER_MIN_VISIBLE_MS = 800;

export abstract class StartupService {
  abstract routeActivated: boolean;
  abstract hideAppInitializer(): void;
  abstract removeAppInitializerElement(): void;
}

@Injectable()
export class AbstractedStartupService extends StartupService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browserWindow = this.document.defaultView;
  private readonly startedAt = this.browserWindow?.performance?.now() ?? 0;

  routeActivated = false;

  hideAppInitializer(): void {
    const browserWindow = this.browserWindow;

    if (!isPlatformBrowser(this.platformId) || !browserWindow) {
      return;
    }

    const elapsed = browserWindow.performance.now() - this.startedAt;
    const remaining = Math.max(0, APP_INITIALIZER_MIN_VISIBLE_MS - elapsed);

    browserWindow.setTimeout(() => {
      browserWindow.requestAnimationFrame(() => {
        browserWindow.requestAnimationFrame(() => {
          this.removeAppInitializerElement();
        });
      });
    }, remaining);
  }

  removeAppInitializerElement(): void {
    const browserWindow = this.browserWindow;

    if (!isPlatformBrowser(this.platformId) || !browserWindow) {
      return;
    }

    const loader = this.document.getElementById('app-initializer');

    if (!loader) {
      return;
    }

    loader.classList.add('app-initializer--hidden');

    browserWindow.setTimeout(() => {
      loader.remove();
    }, APP_INITIALIZER_FADE_DURATION_MS);
  }
}

export const STARTUP_SERVICE_PROVIDER = {
  provide: StartupService,
  useClass: AbstractedStartupService,
};
