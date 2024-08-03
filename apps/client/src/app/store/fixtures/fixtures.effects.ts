import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DateService, HttpFixturesService } from '@app/services';
import { AppState } from '../start.state';
import {
  loadFixtures,
  loadFixturesFailure,
  loadFixturesSuccess,
} from './fixtures.actions';

@Injectable()
export class FixturesEffects {
  actions$ = inject(Actions);
  store = inject(Store<AppState>);
  fs = inject(HttpFixturesService);
  dateService = inject(DateService);

  loadFixtures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFixtures),
      map(() => this.dateService.selectedDay()),
      map((date) => date.split('T')[0]),
      switchMap((date) =>
        from(this.fs.getFixtures(date)).pipe(
          map((fixtures) => loadFixturesSuccess({ fixtures })),
          catchError((error) => of(loadFixturesFailure({ error })))
        )
      )
    )
  );
}
