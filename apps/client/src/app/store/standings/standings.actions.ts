import { StandingsDTO } from '@lib/models';
import { createAction, props } from '@ngrx/store';

export const loadStandings = createAction('[Standings Page] Load Standings');

export const loadStandingsSuccess = createAction(
  '[Standings API] Standings Load Success',
  props<{ standings: StandingsDTO[] }>()
);

export const loadStandingsFailure = createAction(
  '[Standings API] Standings Load Failure',
  props<{ error: string }>()
);
