import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export abstract class HttpRapidService {
  abstract fetchStandings(leagueId: string): Observable<unknown>;
  abstract fetchFixtures(
    leagueId: string,
    matchDay: number
  ): Observable<unknown>;
  abstract fetchStatistics(fixtureId: number): Observable<unknown>;
}

@Injectable()
export class AbstractedHttpRapidService extends HttpRapidService {
  BASE_URL = environment.api;

  http = inject(HttpClient);

  fetchStandings(leagueId: string): Observable<unknown> {
    const url = this.BASE_URL + `standings/fetch?league=${leagueId}`;
    return this.http.get(url);
  }

  fetchFixtures(leagueId: string, matchDay: number): Observable<unknown> {
    const url =
      this.BASE_URL + `fixtures/fetch?league=${leagueId}&round=${matchDay}`;
    return this.http.get(url);
  }

  fetchStatistics(fixtureId: number): Observable<unknown> {
    const url =
      this.BASE_URL + `fixtures-statistics/fetch?fixtureId=${fixtureId}`;
    return this.http.get(url);
  }
}

export const HTTP_RAPID_SERVICE_PROVIDER = {
  provide: HttpRapidService,
  useClass: AbstractedHttpRapidService,
};
