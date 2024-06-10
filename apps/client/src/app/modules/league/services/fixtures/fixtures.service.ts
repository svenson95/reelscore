import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';

import { DateService } from '@app/services';
import { FixtureDTO } from '@lib/models';
import { HttpFixturesService } from './http.service';

export abstract class FixturesService {
  abstract fixtures: Signal<FixtureDTO[] | undefined>;
  abstract isLoading: WritableSignal<boolean>;
}

@Injectable()
export class AbstractedFixturesService extends FixturesService {
  http = inject(HttpFixturesService);
  date = inject(DateService);

  isLoading = signal<boolean>(false);

  fixtures = toSignal(
    toObservable(this.date.selectedDay).pipe(
      tap(() => this.isLoading.set(true)),
      switchMap((d) => this.fixturesForDay(d)),
      tap(() => this.isLoading.set(false))
    )
  );

  fixturesForDay(date: string) {
    const d = new Date(date);
    const nextDay = new Date(d.setDate(d.getDate() + 1)).toISOString();
    const dateString = nextDay.split('T')[0];
    return this.http.getFixtures(dateString);
  }
}

export const FIXTURES_SERVICE_PROVIDER = {
  provide: FixturesService,
  useClass: AbstractedFixturesService,
};
