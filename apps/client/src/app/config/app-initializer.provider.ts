import { inject, provideAppInitializer } from '@angular/core';
import { AppUpdateService } from '../shared/services/app-update.service';
import { StartupService } from '../shared/services/startup.service';

export const APP_INITIALIZER_PROVIDER = provideAppInitializer(() => {
  inject(StartupService);
  inject(AppUpdateService).init();
});
