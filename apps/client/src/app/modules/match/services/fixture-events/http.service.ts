import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  FixtureEventsDTO,
  FixtureEventsResponse,
  FixtureId,
} from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureEventsService {
  abstract getFixtureEvents(
    id: FixtureId
  ): Observable<FixtureEventsDTO | undefined>;
}

@Injectable()
export class AbstractedHttpFixtureEventsService extends HttpFixtureEventsService {
  BASE_URL = environment.api + 'fixture-events';
  http = inject(HttpClient);

  getFixtureEvents(id: FixtureId): Observable<FixtureEventsDTO | undefined> {
    const params = new HttpParams().set('fixtureId', String(id));
    return this.http
      .get<FixtureEventsDTO | null>(this.BASE_URL + '/get', {
        params,
      })
      .pipe(map((d) => d ?? undefined));
  }

  private sortEvents(d: FixtureEventsResponse[]) {
    return d.sort(
      (a, b) => b.time.elapsed + b.time.extra - (a.time.elapsed + a.time.extra)
    );
  }
}

export const HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER = {
  provide: HttpFixtureEventsService,
  useClass: AbstractedHttpFixtureEventsService,
};
