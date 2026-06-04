import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import type {
  ApplicationConfig} from '@angular/core';
import {
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

import { routes } from './app.routes';
import {
  APP_INITIALIZER_PROVIDER,
  CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER,
  LOCALE_PROVIDER,
  PWA_PROVIDER,
} from './config';
import { GLOBAL_SERVICE_PROVIDERS } from './shared';

const BASE_PROVIDERS = [
  provideExperimentalZonelessChangeDetection(),
  provideRouter(
    routes,
    withComponentInputBinding(),
    withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
    }),
    withPreloading(PreloadAllModules)
  ),
  provideAnimationsAsync(),
  provideHttpClient(withInterceptorsFromDi()),
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...BASE_PROVIDERS,
    APP_INITIALIZER_PROVIDER,
    PWA_PROVIDER,
    LOCALE_PROVIDER,
    CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER,
    ...GLOBAL_SERVICE_PROVIDERS,
  ],
};
