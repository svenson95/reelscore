import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import * as de from '@angular/common/locales/de';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
  DATE_SERVICE_PROVIDER,
  FIXTURES_SERVICE_PROVIDER,
  HTTP_FIXTURES_SERVICE_PROVIDER,
  HTTP_STANDINGS_SERVICE_PROVIDER,
  LEAGUE_SERVICE_PROVIDER,
  STANDINGS_SERVICE_PROVIDER,
} from './services';

const LOCALE_PROVIDER = { provide: LOCALE_ID, useValue: 'de-DE' };

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    LOCALE_PROVIDER,
    BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
    DATE_SERVICE_PROVIDER,
    LEAGUE_SERVICE_PROVIDER,
    HTTP_STANDINGS_SERVICE_PROVIDER,
    HTTP_FIXTURES_SERVICE_PROVIDER,
    STANDINGS_SERVICE_PROVIDER,
    FIXTURES_SERVICE_PROVIDER,
  ],
};

registerLocaleData(de.default);
