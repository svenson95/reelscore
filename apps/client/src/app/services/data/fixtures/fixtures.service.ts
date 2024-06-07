import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap, tap } from 'rxjs';

import { FixtureId, LatestFixturesDTO, MatchDTO } from '@lib/models';
import { DateService, HttpFixturesService } from '../../../services';

export abstract class FixturesService {
  abstract fixtures: Signal<MatchDTO[] | undefined>;
  abstract isLoading: WritableSignal<boolean>;
  abstract loadLatestFixtures(id: FixtureId): Observable<LatestFixturesDTO>;
  abstract loadFixture(id: FixtureId): Observable<MatchDTO>;
}

@Injectable()
export class AbstractedFixturesService extends FixturesService {
  http = inject(HttpFixturesService);
  date = inject(DateService);

  isLoading = signal<boolean>(false);

  fixtures = toSignal(
    toObservable(this.date.selectedDay).pipe(
      tap(() => this.isLoading.set(true)),
      switchMap((date) => {
        const d = new Date(date);
        const nextDay = new Date(d.setDate(d.getDate() + 1)).toISOString();
        const dateString = nextDay.split('T')[0];
        return this.http.getFixtures(dateString);
      }),
      tap(() => this.isLoading.set(false))
    )
  );

  loadLatestFixtures(fixtureId: FixtureId): Observable<LatestFixturesDTO> {
    return this.http.getLatestFixtures(fixtureId);
  }

  loadFixture(id: FixtureId): Observable<MatchDTO> {
    return this.http.getFixture(id);
  }
}

export const FIXTURES_SERVICE_PROVIDER = {
  provide: FixturesService,
  useClass: AbstractedFixturesService,
};
