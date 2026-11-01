import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';

import { AppUpdateService } from '../shared/data-access/app-update.service';
import { StartupService } from '../shared/data-access/startup/startup.service';

export const initializeApplication = (): void => {
  // Start the loader visibility timer before Angular bootstraps the root component.
  inject(StartupService);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return;
  }

  // AppUpdateService uses browser-only service worker and document APIs.
  inject(AppUpdateService).init();
};

export const APP_INITIALIZER_PROVIDER = provideAppInitializer(
  initializeApplication
);
