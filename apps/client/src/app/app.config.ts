import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';

import { OVERVIEW_STORE_PROVIDERS } from './features/overview/state';

import {
  APP_INITIALIZER_PROVIDER,
  CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER,
  LOCALE_PROVIDER,
  MATERIAL_TOOLTIP_DEFAULT_OPTIONS_PROVIDER,
  PWA_PROVIDER,
} from './config';
import { apiRequestInterceptor, CORE_PROVIDERS } from './core';
import { SHARED_PROVIDERS } from './shared';

import { routes } from './app.routes';

const ANGULAR_PROVIDERS = [
  provideRouter(
    routes,
    withComponentInputBinding(),
    withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
    }),
    withPreloading(PreloadAllModules)
  ),
  provideHttpClient(
    withInterceptors([apiRequestInterceptor]),
    withInterceptorsFromDi()
  ),
  LOCALE_PROVIDER,
  CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER,
  MATERIAL_TOOLTIP_DEFAULT_OPTIONS_PROVIDER,
  PWA_PROVIDER,
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...ANGULAR_PROVIDERS,
    ...CORE_PROVIDERS,
    ...SHARED_PROVIDERS,
    ...OVERVIEW_STORE_PROVIDERS,
    APP_INITIALIZER_PROVIDER,
  ],
};
