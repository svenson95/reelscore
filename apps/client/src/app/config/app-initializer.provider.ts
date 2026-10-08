import { inject, provideAppInitializer } from '@angular/core';

import { AppUpdateService } from '../shared/data-access/app-update.service';
import { StartupService } from '../shared/data-access/startup/startup.service';

export const APP_INITIALIZER_PROVIDER = provideAppInitializer(() => {
  inject(StartupService);
  inject(AppUpdateService).init();
});
