import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, LatestFixturesDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixturesService {
  abstract getLatestFixtures(
    fixtureId: FixtureId
  ): Observable<LatestFixturesDTO>;
}

@Injectable()
export class AbstractedHttpFixturesService extends HttpFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getLatestFixtures(fixtureId: FixtureId): Observable<LatestFixturesDTO> {
    const params = new HttpParams().set('fixtureId', fixtureId);
    return this.http.get<LatestFixturesDTO>(this.BASE_URL + '/get-latest', {
      params,
    });
  }
}

export const HTTP_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpFixturesService,
  useClass: AbstractedHttpFixturesService,
};
