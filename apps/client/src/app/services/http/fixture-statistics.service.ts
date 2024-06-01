import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, FixtureStatisticsDTO } from '@lib/models';

import { environment } from '../../../environments/environment';

export abstract class HttpFixtureStatisticsService {
  abstract getFixtureStatistics(
    id: FixtureId
  ): Observable<FixtureStatisticsDTO>;
}

@Injectable()
export class AbstractedHttpFixtureStatisticsService extends HttpFixtureStatisticsService {
  BASE_URL = environment.api;

  http = inject(HttpClient);

  getFixtureStatistics(id: FixtureId): Observable<FixtureStatisticsDTO> {
    const params = new HttpParams().set('fixtureId', String(id));
    return this.http.get<FixtureStatisticsDTO>(
      this.BASE_URL + 'fixture-statistics/get',
      {
        params,
      }
    );
  }
}

export const HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER = {
  provide: HttpFixtureStatisticsService,
  useClass: AbstractedHttpFixtureStatisticsService,
};
