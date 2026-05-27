import { inject, provideAppInitializer } from '@angular/core';
import { StartupService } from '../shared/services/startup.service';

export const APP_INITIALIZER_PROVIDER = provideAppInitializer(() => {
  inject(StartupService);
});
