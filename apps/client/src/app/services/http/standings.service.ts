import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { CompetitionId, StandingsDTO } from '../../models';

export abstract class HttpStandingsService {
  abstract getStandings(id: CompetitionId): Observable<StandingsDTO>;
}

@Injectable()
export class AbstractedHttpStandingsService extends HttpStandingsService {
  BASE_URL = environment.api;

  http = inject(HttpClient);

  getStandings(id: CompetitionId): Observable<StandingsDTO> {
    const params = new HttpParams().set('league', id).set('season', '2023');
    return this.http.get<StandingsDTO>(this.BASE_URL + 'standings/get', {
      params,
    });
  }
}

export const HTTP_STANDINGS_SERVICE_PROVIDER = {
  provide: HttpStandingsService,
  useClass: AbstractedHttpStandingsService,
};
