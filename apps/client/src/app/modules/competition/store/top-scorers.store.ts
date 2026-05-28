import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/shared';
import { CompetitionId, TopScorersDTO } from '@lib/models';

import { HttpTopScorersService } from '../services';

type TopScorersState = StateHandler<{
  topScorers: TopScorersDTO | null;
}>;

const initialState: TopScorersState = {
  topScorers: null,
  isLoading: false,
  error: null,
};

export const TopScorersStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpTopScorersService)) => ({
    async loadTopScorers(id: CompetitionId): Promise<void> {
      patchState(store, { isLoading: true });

      http.getTopScorersForCompetition(id).subscribe({
        next: (topScorers) =>
          patchState(store, {
            topScorers,
            isLoading: false,
            error: topScorers ? null : 'TopScorers not found',
          }),
        error: (error) =>
          patchState(store, {
            topScorers: null,
            isLoading: false,
            error,
          }),
      });
    },
  }))
);
