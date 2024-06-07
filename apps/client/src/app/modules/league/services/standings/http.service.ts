import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CompetitionId } from '@app/models';
import { StandingsDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

type StandingsParams = undefined | CompetitionId;

export abstract class HttpStandingsService {
  abstract getStandings(id: StandingsParams): Observable<StandingsDTO>;
  abstract getAllStandings(): Observable<StandingsDTO[]>;
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
}

export const HTTP_STANDINGS_SERVICE_PROVIDER = {
  provide: HttpStandingsService,
  useClass: AbstractedHttpStandingsService,
};
