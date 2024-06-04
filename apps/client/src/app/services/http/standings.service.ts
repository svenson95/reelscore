import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { StandingsDTO } from '@lib/models';

import { environment } from '../../../environments/environment';

import { CompetitionId } from '../../models';

type StandingsParams = undefined | CompetitionId;

export abstract class HttpStandingsService {
  abstract getStandings(id: StandingsParams): Observable<StandingsDTO>;
  abstract getAllStandings(): Observable<StandingsDTO[]>;
  abstract getAllStandingsCount(): Observable<number>;
}

@Injectable()
export class AbstractedHttpStandingsService extends HttpStandingsService {
  BASE_URL = environment.api + 'standings';

  http = inject(HttpClient);

  getStandings(id: StandingsParams): Observable<StandingsDTO> {
    let params = new HttpParams();
    if (id) params = params.append('league', id);
    return this.http.get<StandingsDTO>(this.BASE_URL + '/get', {
      params,
    });
  }

  getAllStandings(): Observable<StandingsDTO[]> {
    return this.http.get<StandingsDTO[]>(this.BASE_URL + '/get-top-five');
  }

  getAllStandingsCount(): Observable<number> {
    return this.http.get<number>(this.BASE_URL + '/count');
  }
}

export const HTTP_STANDINGS_SERVICE_PROVIDER = {
  provide: HttpStandingsService,
  useClass: AbstractedHttpStandingsService,
};
