import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import * as de from '@angular/common/locales/de';
import {
  ApplicationConfig,
  LOCALE_ID,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import {
  BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
  DATE_SERVICE_PROVIDER,
  LEAGUE_SERVICE_PROVIDER,
} from './services';

const LOCALE_PROVIDER = { provide: LOCALE_ID, useValue: 'de-DE' };

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimationsAsync(),
    provideHttpClient(),
    LOCALE_PROVIDER,
    BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
    DATE_SERVICE_PROVIDER,
    LEAGUE_SERVICE_PROVIDER,
  ],
};

registerLocaleData(de.default);
