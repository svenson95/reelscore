import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CompetitionId, StandingsDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureStandingsService {
  abstract getFixtureStandings(
    teamIds: string,
    competition: CompetitionId
  ): Observable<StandingsDTO>;
}

@Injectable()
export class AbstractedHttpFixtureStandingsService extends HttpFixtureStandingsService {
  BASE_URL = environment.api + 'standings';
  http = inject(HttpClient);

  getFixtureStandings(
    teamIds: string,
    competition: CompetitionId
  ): Observable<StandingsDTO> {
    const params = new HttpParams()
      .set('teamIds', teamIds)
      .set('competition', competition);
    return this.http.get<StandingsDTO>(this.BASE_URL + '/match-standings', {
      params,
    });
  }
}

export const HTTP_FIXTURE_STANDINGS_SERVICE_PROVIDER = {
  provide: HttpFixtureStandingsService,
  useClass: AbstractedHttpFixtureStandingsService,
};
