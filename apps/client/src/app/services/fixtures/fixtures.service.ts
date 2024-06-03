import { Injectable, Signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';

import { FixtureId, MatchDTO } from '@lib/models';

import { DateService, HttpFixturesService } from '../../services';
export abstract class FixturesService {
  abstract fixtures: Signal<MatchDTO[] | undefined>;
  abstract loadFixture(id: FixtureId): Observable<MatchDTO>;
}

@Injectable()
export class AbstractedFixturesService extends FixturesService {
  http = inject(HttpFixturesService);
  date = inject(DateService);

  fixtures = toSignal(
    toObservable(this.date.selectedDay).pipe(
      switchMap((date) => {
        const d = new Date(date);
        const nextDay = new Date(d.setDate(d.getDate() + 1)).toISOString();
        const dateString = nextDay.split('T')[0];
        return this.http.getFixtures(dateString);
      })
    )
  );

  loadFixture(id: FixtureId): Observable<MatchDTO> {
    return this.http.getFixture(id);
  }
}

export const FIXTURES_SERVICE_PROVIDER = {
  provide: FixturesService,
  useClass: AbstractedFixturesService,
};
