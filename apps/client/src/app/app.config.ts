import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
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
  LOCALE_PROVIDER,
} from './config';
import { GLOBAL_SERVICE_PROVIDERS, GLOBAL_STORE_PROVIDERS } from './shared';

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

const PWA_PROVIDERS = [
  provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000',
  }),
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...BASE_PROVIDERS,
    ...PWA_PROVIDERS,
    LOCALE_PROVIDER,
    CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER,
    ...GLOBAL_SERVICE_PROVIDERS,
    ...GLOBAL_STORE_PROVIDERS,
  ],
};
