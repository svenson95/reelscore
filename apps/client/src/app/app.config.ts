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
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import {
  BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
  DATE_SERVICE_PROVIDER,
  HTTP_FIXTURE_SERVICE_PROVIDER,
  HTTP_FIXTURES_SERVICE_PROVIDER,
  HTTP_STANDINGS_SERVICE_PROVIDER,
  LEAGUE_SERVICE_PROVIDER,
} from './services';
import { FixturesEffects } from './store/fixtures/fixtures.effects';
import { fixturesReducer } from './store/fixtures/fixtures.reducer';
import { StandingsEffects } from './store/standings/standings.effects';
import { standingsReducer } from './store/standings/standings.reducer';

const LOCALE_PROVIDER = { provide: LOCALE_ID, useValue: 'de-DE' };

const STORE_PROVIDERS = [
  provideStore({ standings: standingsReducer, fixtures: fixturesReducer }),
  provideEffects([StandingsEffects, FixturesEffects]),
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
    ...HTTP_DATA_PROVIDERS,
    ...STORE_PROVIDERS,
  ],
};

registerLocaleData(de.default);
