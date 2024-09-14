import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, MetricsDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureMetricsService {
  abstract getFixtureMetrics(id: FixtureId): Observable<MetricsDTO>;
}

@Injectable()
export class AbstractedHttpFixtureMetricsService extends HttpFixtureMetricsService {
  BASE_URL = environment.api + 'fixture-metrics';
  http = inject(HttpClient);

  getFixtureMetrics(id: FixtureId): Observable<MetricsDTO> {
    const params = new HttpParams().set('fixture', String(id));
    return this.http.get<MetricsDTO>(this.BASE_URL + '/get', {
      params,
    });
  }
}

export const HTTP_FIXTURE_METRICS_SERVICE_PROVIDER = {
  provide: HttpFixtureMetricsService,
  useClass: AbstractedHttpFixtureMetricsService,
};
