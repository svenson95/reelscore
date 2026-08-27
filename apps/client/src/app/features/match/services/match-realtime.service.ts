import { DestroyRef, inject, Injectable } from '@angular/core';

import type { FixtureId } from '@lib/models';

import { RealtimeUpdateRegistryService } from '@app/shared';

import { EventsStore, FixtureStore } from '../store';

@Injectable()
export class MatchRealtimeService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly fixtureStore = inject(FixtureStore);
  private readonly eventsStore = inject(EventsStore);
  private readonly realtimeUpdateRegistry = inject(
    RealtimeUpdateRegistryService
  );

  private unregister?: () => void;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.unregister?.();
    });
  }

  register(fixtureId: FixtureId): () => void {
    this.unregister?.();

    const unregister = this.realtimeUpdateRegistry.register({
      fixtureId,

      getTeams: () => this.fixtureStore.fixture()?.data.teams ?? null,

      updateFixture: (fixture): void => {
        this.fixtureStore.updateFixture(fixture);
      },

      updateEvents: (events, teams): void => {
        this.eventsStore.updateEvents(events, teams);
      },
    });

    this.unregister = unregister;

    return () => {
      if (this.unregister !== unregister) {
        return;
      }

      unregister();
      this.unregister = undefined;
    };
  }
}
