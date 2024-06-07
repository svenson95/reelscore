import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, MatchDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureService {
  abstract getFixture(id: FixtureId): Observable<MatchDTO>;
}

@Injectable()
export class AbstractedHttpFixtureService extends HttpFixtureService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getFixture(id: FixtureId): Observable<MatchDTO> {
    const params = new HttpParams().set('fixtureId', String(id));
    return this.http.get<MatchDTO>(this.BASE_URL + '/get', { params });
  }
}

export const HTTP_FIXTURE_SERVICE_PROVIDER = {
  provide: HttpFixtureService,
  useClass: AbstractedHttpFixtureService,
};
