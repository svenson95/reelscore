import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CompetitionId, StandingsDTO } from '../../models';

export abstract class DatabaseStandingsService {
  abstract getStandings(id: CompetitionId): Observable<StandingsDTO>;
}

@Injectable()
export class AbstractedDatabaseStandingsService {
  BASE_URL = 'http://localhost:3333';

  http = inject(HttpClient);

  getStandings(id: CompetitionId): Observable<StandingsDTO> {
    const params = new HttpParams().set('league', id).set('season', '2023');
    return this.http.get<StandingsDTO>(this.BASE_URL + '/standings/get', {
      params,
    });
  }
}

export const DATABASE_STANDINGS_SERVICE_PROVIDER = {
  provide: DatabaseStandingsService,
  useClass: AbstractedDatabaseStandingsService,
};
