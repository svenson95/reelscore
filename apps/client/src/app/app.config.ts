import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
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

const MATERIAL_TOOLTIP_DEFAULT_OPTIONS_PROVIDER = {
  provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
  useValue: {
    showDelay: 400,
    hideDelay: 0,
    touchGestures: 'auto',
    touchendHideDelay: 2000,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    PWA_PROVIDER,
    ...BASE_PROVIDERS,
    APP_INITIALIZER_PROVIDER,
    LOCALE_PROVIDER,
    CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER,
    ...GLOBAL_SERVICE_PROVIDERS,
    MATERIAL_TOOLTIP_DEFAULT_OPTIONS_PROVIDER,
  ],
};
