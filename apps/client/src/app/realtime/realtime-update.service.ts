import { effect, inject, Injectable, Injector } from '@angular/core';

import type { FixtureDTO, RapidEventsDTO } from '@lib/models';

import { WeekFixturesStore } from '../features/overview/stores';

import { RealtimeUpdateRegistryService } from '../shared/services/realtime-update-registry.service';
import { RealtimeService } from '../shared/services/realtime.service';

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
        const update = this.realtimeService.fixtureUpdate();

        if (!update) {
          return;
        }

        const fixture: FixtureDTO | undefined = update.operation.documents[0];

        if (!fixture) {
          return;
        }

        this.weekFixturesStore.updateFixture(fixture);
        this.updateRegistry.updateFixture(fixture);
      },
      {
        injector: this.injector,
      }
    );

    effect(
      () => {
        const update = this.realtimeService.fixtureEventsUpdate();

        if (!update) {
          return;
        }

        const events: RapidEventsDTO | undefined =
          update.operation.documents[0];

        if (!events) {
          return;
        }

        this.updateRegistry.updateEvents(update.fixtureId, events);
      },
      {
        injector: this.injector,
      }
    );
  }
}
