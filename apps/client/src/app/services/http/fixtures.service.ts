import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, MatchDTO } from '@lib/models';

import { environment } from '../../../environments/environment';

import { DateString } from '../../models';

export abstract class HttpFixturesService {
  abstract getFixtures(date: DateString): Observable<MatchDTO[]>;
  abstract getFixtureDetails(id: FixtureId): Observable<MatchDTO>;
}

@Injectable()
export class AbstractedHttpFixturesService extends HttpFixturesService {
  BASE_URL = environment.api;

  http = inject(HttpClient);

  getFixtures(date: DateString): Observable<MatchDTO[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<MatchDTO[]>(this.BASE_URL + 'fixtures/get', {
      params,
    });
  }

  getFixtureDetails(id: FixtureId): Observable<MatchDTO> {
    const params = new HttpParams().set('fixtureId', String(id));
    return this.http.get<MatchDTO>(this.BASE_URL + 'fixtures/get', { params });
  }
}

export const HTTP_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpFixturesService,
  useClass: AbstractedHttpFixturesService,
};
