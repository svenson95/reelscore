import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { FixtureIdParameter, RapidEventsDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureEventsService {
  abstract getFixtureEvents(
    id: FixtureIdParameter
  ): Observable<RapidEventsDTO | undefined>;
}

@Injectable()
export class AbstractedHttpFixtureEventsService extends HttpFixtureEventsService {
  BASE_URL = environment.api + 'fixture-events';
  http = inject(HttpClient);

  getFixtureEvents(
    id: FixtureIdParameter
  ): Observable<RapidEventsDTO | undefined> {
    const params = new HttpParams().set('fixture', id);
    return this.http
      .get<RapidEventsDTO | null>(this.BASE_URL + '', { params })
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        map((d) => d ?? undefined)
      );
  }
}

export const HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER = {
  provide: HttpFixtureEventsService,
  useClass: AbstractedHttpFixtureEventsService,
};
