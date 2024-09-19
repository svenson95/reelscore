import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, LatestFixturesDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpLatestFixturesService {
  abstract getLatestFixtures(
    fixtureId: FixtureId
  ): Observable<LatestFixturesDTO>;
}

@Injectable()
export class AbstractedHttpLatestFixturesService extends HttpLatestFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getLatestFixtures(fixtureId: FixtureId): Observable<LatestFixturesDTO> {
    const params = new HttpParams().set('fixture', fixtureId);
    return this.http.get<LatestFixturesDTO>(this.BASE_URL + '/match-latest', {
      params,
    });
  }
}

export const HTTP_LATEST_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpLatestFixturesService,
  useClass: AbstractedHttpLatestFixturesService,
};
