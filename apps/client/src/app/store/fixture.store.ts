import { inject } from '@angular/core';
import { FixtureDTO, FixtureId } from '@lib/models';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { HttpFixtureService } from '@app/services';

type FixtureState = {
  fixture: FixtureDTO | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: FixtureState = {
  fixture: null,
  isLoading: false,
  error: null,
};

export const FixtureStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureService)) => ({
    async loadFixture(id: FixtureId): Promise<void> {
      patchState(store, { isLoading: true });
      const fixture = id ? await firstValueFrom(http.getFixture(id)) : null;
      patchState(store, {
        fixture,
        isLoading: false,
        error: fixture ? null : 'Fixture not found',
      });
    },
  }))
);
