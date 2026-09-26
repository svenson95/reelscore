import { effect, inject, Injectable, Injector } from '@angular/core';

import { RealtimeService, RealtimeUpdateRegistryService } from '@app/shared';
import type { FixtureDTO } from '@lib/models';

// TODO: refactor week store to core (2)
import { WeekFixturesStore } from '../../features/overview/stores';

@Injectable()
export class RealtimeUpdateService {
  private readonly injector = inject(Injector);
  private readonly realtimeService = inject(RealtimeService);
  private readonly updateRegistry = inject(RealtimeUpdateRegistryService);
  private readonly weekFixturesStore = inject(WeekFixturesStore);

  private initialized = false;

  init(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    effect(
      () => {
        const batch = this.realtimeService.fixturesUpdate();

        if (!batch) {
          return;
        }

        const fixtures = batch.updates
          .map((update) => update.operation.documents[0])
          .filter((fixture): fixture is FixtureDTO => fixture != null);

        if (fixtures.length === 0) {
          return;
        }

        this.weekFixturesStore.updateFixtures(fixtures);
        this.updateRegistry.updateFixtures(fixtures);
      },
      {
        injector: this.injector,
      }
    );

    effect(
      () => {
        const batch = this.realtimeService.fixtureEventsUpdate();

        if (!batch) {
          return;
        }

        this.updateRegistry.updateEvents(batch.updates);
      },
      {
        injector: this.injector,
      }
    );
  }
}
