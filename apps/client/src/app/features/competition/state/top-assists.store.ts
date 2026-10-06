import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { CompetitionId, TopAssistsDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpTopAssistsService } from '../data-access';

type TopAssistsState = StateHandler<{
  topAssists: TopAssistsDTO | null;
}>;

const initialState: TopAssistsState = {
  topAssists: null,
  isLoading: false,
  error: null,
};

export const TopAssistsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpTopAssistsService)) => ({
    loadTopAssists(id: CompetitionId): void {
      patchState(store, { isLoading: true });

      http
        .getTopAssistsForCompetition(id)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (topAssists) =>
            patchState(store, {
              topAssists,
              isLoading: false,
              error: topAssists ? null : 'TopAssists not found',
            }),
          error: (error) =>
            patchState(store, {
              topAssists: null,
              isLoading: false,
              error,
            }),
        });
    },
  }))
);
