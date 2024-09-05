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
  BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
  DATE_SERVICE_PROVIDER,
  FILTER_SERVICE_PROVIDER,
  HTTP_FIXTURE_SERVICE_PROVIDER,
  HTTP_FIXTURES_SERVICE_PROVIDER,
  HTTP_STANDINGS_SERVICE_PROVIDER,
  LEAGUE_SERVICE_PROVIDER,
  ROUTE_SERVICE_PROVIDER,
} from './services';
import {
  FixturesStore,
  FixtureStore,
  StandingsStore,
  StandingStore,
} from './store';

const LOCALE_PROVIDER = { provide: LOCALE_ID, useValue: 'de-DE' };

const SERVICE_PRODIVDERS = [
  BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
  DATE_SERVICE_PROVIDER,
  LEAGUE_SERVICE_PROVIDER,
  FILTER_SERVICE_PROVIDER,
  ROUTE_SERVICE_PROVIDER,
];

const STORE_PROVIDERS = [
  StandingStore,
  StandingsStore,
  FixtureStore,
  FixturesStore,
];

const HTTP_DATA_PROVIDERS = [
  HTTP_STANDINGS_SERVICE_PROVIDER,
  HTTP_FIXTURES_SERVICE_PROVIDER,
  HTTP_FIXTURE_SERVICE_PROVIDER,
];

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
    ...SERVICE_PRODIVDERS,
    ...HTTP_DATA_PROVIDERS,
    ...STORE_PROVIDERS,
  ],
};

registerLocaleData(de.default);
