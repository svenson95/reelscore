import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, RapidStatisticsDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureStatisticsService {
  abstract getFixtureStatistics(
    id: FixtureId
  ): Observable<RapidStatisticsDTO | null>;
}

@Injectable()
export class AbstractedHttpFixtureStatisticsService extends HttpFixtureStatisticsService {
  BASE_URL = environment.api + 'fixture-statistics';
  http = inject(HttpClient);

  getFixtureStatistics(id: FixtureId): Observable<RapidStatisticsDTO | null> {
    const params = new HttpParams().set('fixtureId', String(id));
    return this.http.get<RapidStatisticsDTO | null>(this.BASE_URL + '', {
      params,
    });
  }
}

export const HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER = {
  provide: HttpFixtureStatisticsService,
  useClass: AbstractedHttpFixtureStatisticsService,
};
