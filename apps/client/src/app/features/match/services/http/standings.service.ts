import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { shareReplay } from 'rxjs';

import type { CompetitionId, StandingsDTO } from '@lib/models';
import type { DateString } from '@lib/shared';

import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureStandingsService {
  abstract getFixtureStandings(
    teamIds: string,
    competition: CompetitionId,
    date: DateString
  ): Observable<StandingsDTO>;
}

@Injectable()
export class AbstractedHttpFixtureStandingsService extends HttpFixtureStandingsService {
  BASE_URL = environment.api + 'standings';
  http = inject(HttpClient);

  getFixtureStandings(
    teamIds: string,
    competition: CompetitionId,
    date: DateString
  ): Observable<StandingsDTO> {
    const params = new HttpParams()
      .set('teamIds', teamIds)
      .set('competition', competition)
      .set('date', date);
    return this.http
      .get<StandingsDTO>(this.BASE_URL + '/match-standings', {
        params,
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_FIXTURE_STANDINGS_SERVICE_PROVIDER = {
  provide: HttpFixtureStandingsService,
  useClass: AbstractedHttpFixtureStandingsService,
};
