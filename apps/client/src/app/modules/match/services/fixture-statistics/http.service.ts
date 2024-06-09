import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { FixtureId, FixtureStatisticsDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureStatisticsService {
  abstract getFixtureStatistics(
    id: FixtureId
  ): Observable<FixtureStatisticsDTO | undefined>;
}

@Injectable()
export class AbstractedHttpFixtureStatisticsService extends HttpFixtureStatisticsService {
  BASE_URL = environment.api + 'fixture-statistics';
  http = inject(HttpClient);

  getFixtureStatistics(
    id: FixtureId
  ): Observable<FixtureStatisticsDTO | undefined> {
    const params = new HttpParams().set('fixtureId', String(id));
    return this.http
      .get<FixtureStatisticsDTO | null>(this.BASE_URL + '/get', {
        params,
      })
      .pipe(map((d) => d ?? undefined));
  }
}

export const HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER = {
  provide: HttpFixtureStatisticsService,
  useClass: AbstractedHttpFixtureStatisticsService,
};
