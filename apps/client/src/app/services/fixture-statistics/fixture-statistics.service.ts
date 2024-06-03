import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

import { FixtureId, FixtureStatisticsDTO } from '@lib/models';

import { DateService, HttpFixtureStatisticsService } from '../../services';

export abstract class FixtureStatisticsService {
  abstract fixtureId: WritableSignal<FixtureId | undefined>;
  abstract statistics: Signal<FixtureStatisticsDTO | undefined>;
}

@Injectable()
export class AbstractedFixtureStatisticsService extends FixtureStatisticsService {
  http = inject(HttpFixtureStatisticsService);
  date = inject(DateService);

  fixtureId = signal<FixtureId | undefined>(undefined);

  statistics = toSignal(
    toObservable(this.fixtureId).pipe(
      map((id) => id as FixtureId), // TODO filter id is undefined
      switchMap((id) =>
        id ? this.http.getFixtureStatistics(id) : of(undefined)
      )
    )
  );
}

export const FIXTURE_STATISTICS_SERVICE_PROVIDER = {
  provide: FixtureStatisticsService,
  useClass: AbstractedFixtureStatisticsService,
};
