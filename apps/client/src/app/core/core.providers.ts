import type { Provider } from '@angular/core';

import { RealtimeUpdateService } from './realtime/realtime-update.service';
import { WeekFixturesStore } from './week-data/week-fixtures/week-fixtures.store';

export const CORE_PROVIDERS: Provider[] = [
  RealtimeUpdateService,
  WeekFixturesStore,
];
