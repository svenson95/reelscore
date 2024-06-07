import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FixtureEventsDTO,
  FixtureId,
  FixtureStatisticsDTO,
  MatchDTO,
  StandingsDTO,
} from '@lib/models';
import { environment } from '../../../../environments/environment';
import { CompetitionId } from '../../../models';

export abstract class HttpRapidService {
  abstract fetchStandings(leagueId: CompetitionId): Observable<StandingsDTO>;
  abstract fetchFixtures(
    leagueId: CompetitionId,
    matchDay: number
  ): Observable<MatchDTO>;
  abstract fetchStatistics(
    fixtureId: FixtureId
  ): Observable<FixtureStatisticsDTO>;
  abstract fetchEvents(fixtureId: FixtureId): Observable<FixtureEventsDTO>;
}

@Injectable()
export class AbstractedHttpRapidService extends HttpRapidService {
  BASE_URL = environment.api;

  http = inject(HttpClient);

  fetchStandings(leagueId: CompetitionId): Observable<StandingsDTO> {
    const url = this.BASE_URL + `standings/fetch?league=${leagueId}`;
    return this.http.get<StandingsDTO>(url);
  }

  fetchFixtures(
    leagueId: CompetitionId,
    matchDay: number
  ): Observable<MatchDTO> {
    const url =
      this.BASE_URL + `fixtures/fetch?league=${leagueId}&round=${matchDay}`;
    return this.http.get<MatchDTO>(url);
  }

  fetchStatistics(fixtureId: FixtureId): Observable<FixtureStatisticsDTO> {
    const url =
      this.BASE_URL + `fixture-statistics/fetch?fixtureId=${fixtureId}`;
    return this.http.get<FixtureStatisticsDTO>(url);
  }

  fetchEvents(fixtureId: FixtureId): Observable<FixtureEventsDTO> {
    const url = this.BASE_URL + `fixture-events/fetch?fixture=${fixtureId}`;
    return this.http.get<FixtureEventsDTO>(url);
  }
}

export const HTTP_RAPID_SERVICE_PROVIDER = {
  provide: HttpRapidService,
  useClass: AbstractedHttpRapidService,
};
