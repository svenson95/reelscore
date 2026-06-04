import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import {
  errorHandler,
  HttpStandingsService,
  type StateHandler,
} from '@app/shared';
import type { CompetitionId, StandingsDTO } from '@lib/models';
import type { DateString } from '@lib/shared';

type CompetitionStandingsState = StateHandler<{
  standings: StandingsDTO | null;
}>;

const initialState: CompetitionStandingsState = {
  standings: null,
  isLoading: false,
  error: null,
};

export const CompetitionStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadStandings(id: CompetitionId, date: DateString): Promise<void> {
      patchState(store, { isLoading: true });

      http
        .getStandings(id, date)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (standings) =>
            patchState(store, {
              standings,
              isLoading: false,
              error: standings ? null : 'CompetitionStandings not found',
            }),
          error: (error) =>
            patchState(store, {
              standings: null,
              isLoading: false,
              error,
            }),
        });
    },
  }))
);
