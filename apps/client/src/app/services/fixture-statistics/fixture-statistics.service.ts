import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, FixtureStatisticsDTO } from '@lib/models';

import { DateService, HttpFixtureStatisticsService } from '../../services';

export abstract class FixtureStatisticsService {
  abstract requestFixtureStatistics(
    id: FixtureId
  ): Observable<FixtureStatisticsDTO>;
}

@Injectable()
export class AbstractedFixtureStatisticsService extends FixtureStatisticsService {
  http = inject(HttpFixtureStatisticsService);
  date = inject(DateService);

  requestFixtureStatistics(id: FixtureId): Observable<FixtureStatisticsDTO> {
    return this.http.getFixtureStatistics(id);
  }
}

export const FIXTURE_STATISTICS_SERVICE_PROVIDER = {
  provide: FixtureStatisticsService,
  useClass: AbstractedFixtureStatisticsService,
};
