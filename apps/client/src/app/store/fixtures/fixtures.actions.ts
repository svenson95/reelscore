import { FixtureDTO } from '@lib/models';
import { createAction, props } from '@ngrx/store';

export const loadFixtures = createAction('[Fixtures Page] Load Fixtures');

export const loadFixturesSuccess = createAction(
  '[Fixtures API] Fixtures Load Success',
  props<{ fixtures: FixtureDTO[] }>()
);

export const loadFixturesFailure = createAction(
  '[Fixtures API] Fixtures Load Failure',
  props<{ error: string }>()
);
