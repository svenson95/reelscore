import { FixtureDTO } from '@lib/models';
import { createReducer, on } from '@ngrx/store';

import {
  loadFixtures,
  loadFixturesFailure,
  loadFixturesSuccess,
} from './fixtures.actions';

export interface FixturesState {
  fixtures: FixtureDTO[];
  error: string | null;
  isLoading: boolean;
  isLoaded: boolean;
}

const initialState: FixturesState = {
  fixtures: [],
  error: null,
  isLoading: false,
  isLoaded: false,
};

export const fixturesReducer = createReducer(
  initialState,
  on(loadFixtures, (state) => ({ ...state, isLoading: true })),
  on(loadFixturesSuccess, (state, { fixtures }) => ({
    ...state,
    fixtures,
    isLoading: false,
    isLoaded: true,
  })),
  on(loadFixturesFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
