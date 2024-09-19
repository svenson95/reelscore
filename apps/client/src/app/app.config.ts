import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import * as de from '@angular/common/locales/de';
import {
  ApplicationConfig,
  isDevMode,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import {
  CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER,
  GLOBAL_SERVICE_PROVIDERS,
  GLOBAL_STORE_PROVIDERS,
} from './shared';

const LOCALE_PROVIDER = { provide: LOCALE_ID, useValue: 'de-DE' };

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
      withPreloading(PreloadAllModules)
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimationsAsync(),
    provideHttpClient(),
    LOCALE_PROVIDER,
    CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER,
    ...GLOBAL_SERVICE_PROVIDERS,
    ...GLOBAL_STORE_PROVIDERS,
  ],
};

registerLocaleData(de.default);
