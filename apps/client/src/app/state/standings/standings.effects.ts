import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DateService, HttpStandingsService } from '@app/services';
import { AppState } from '../start.state';
import {
  loadStandings,
  loadStandingsFailure,
  loadStandingsSuccess,
} from './standings.actions';

@Injectable()
export class StandingsEffects {
  actions$ = inject(Actions);
  store = inject(Store<AppState>);
  standingsService = inject(HttpStandingsService);
  dateService = inject(DateService);

  loadStandings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStandings),
      map(() => this.dateService.selectedDay()),
      switchMap((date) =>
        from(this.standingsService.getAllStandings(date)).pipe(
          map((standings) => loadStandingsSuccess({ standings })),
          catchError((error) => of(loadStandingsFailure({ error })))
        )
      )
    )
  );
}
