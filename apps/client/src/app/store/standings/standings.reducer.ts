import { StandingsDTO } from '@lib/models';
import { createReducer, on } from '@ngrx/store';

import {
  loadStandings,
  loadStandingsFailure,
  loadStandingsSuccess,
} from './standings.actions';

export interface StandingsState {
  standings: StandingsDTO[];
  error: string | null;
  isLoading: boolean;
  isLoaded: boolean;
}

const initialState: StandingsState = {
  standings: [],
  error: null,
  isLoading: false,
  isLoaded: false,
};

export const standingsReducer = createReducer(
  initialState,
  on(loadStandings, (state) => ({ ...state, isLoading: true })),
  on(loadStandingsSuccess, (state, { standings }) => ({
    ...state,
    standings,
    isLoading: false,
    isLoaded: true,
  })),
  on(loadStandingsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
