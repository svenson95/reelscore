import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { FixtureIdParameter, RapidStatisticsDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureStatisticsService {
  abstract getFixtureStatistics(
    id: FixtureIdParameter
  ): Observable<RapidStatisticsDTO | null>;
}

@Injectable()
export class AbstractedHttpFixtureStatisticsService extends HttpFixtureStatisticsService {
  BASE_URL = environment.api + 'fixture-statistics';
  http = inject(HttpClient);

  getFixtureStatistics(
    id: FixtureIdParameter
  ): Observable<RapidStatisticsDTO | null> {
    const params = new HttpParams().set('fixture', id);
    return this.http
      .get<RapidStatisticsDTO | null>(this.BASE_URL + '', {
        params,
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER = {
  provide: HttpFixtureStatisticsService,
  useClass: AbstractedHttpFixtureStatisticsService,
};
