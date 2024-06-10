import { Injectable, Signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { StatisticsDTO } from '@lib/models';
import { FixtureService } from '../../services';
import { HttpFixtureStatisticsService } from './http.service';

export abstract class FixtureStatisticsService {
  abstract statistics: Signal<StatisticsDTO | undefined>;
}

@Injectable()
export class AbstractedFixtureStatisticsService extends FixtureStatisticsService {
  http = inject(HttpFixtureStatisticsService);
  fs = inject(FixtureService);

  statistics = toSignal(
    toObservable(this.fs.fixtureId).pipe(
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
