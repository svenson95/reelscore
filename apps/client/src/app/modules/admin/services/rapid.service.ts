import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, FixtureStatisticsDTO } from '@lib/models';
import { environment } from '../../../../environments/environment';
import { CompetitionId } from '../../../models';

export abstract class HttpRapidService {
  abstract fetchStandings(leagueId: CompetitionId): Observable<unknown>;
  abstract fetchFixtures(
    leagueId: CompetitionId,
    matchDay: number
  ): Observable<unknown>;
  abstract fetchStatistics(
    fixtureId: FixtureId
  ): Observable<FixtureStatisticsDTO>;
}

@Injectable()
export class AbstractedHttpRapidService extends HttpRapidService {
  BASE_URL = environment.api;

  http = inject(HttpClient);

  fetchStandings(leagueId: CompetitionId): Observable<unknown> {
    const url = this.BASE_URL + `standings/fetch?league=${leagueId}`;
    return this.http.get(url);
  }

  fetchFixtures(
    leagueId: CompetitionId,
    matchDay: number
  ): Observable<unknown> {
    const url =
      this.BASE_URL + `fixtures/fetch?league=${leagueId}&round=${matchDay}`;
    return this.http.get(url);
  }

  fetchStatistics(fixtureId: FixtureId): Observable<FixtureStatisticsDTO> {
    const url =
      this.BASE_URL + `fixture-statistics/fetch?fixtureId=${fixtureId}`;
    return this.http.get<FixtureStatisticsDTO>(url);
  }
}

export const HTTP_RAPID_SERVICE_PROVIDER = {
  provide: HttpRapidService,
  useClass: AbstractedHttpRapidService,
};
