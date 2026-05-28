import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { CompetitionId, TopScorersDTO } from '@lib/models';

import { environment } from '../../../../environments/environment';

export abstract class HttpTopScorersService {
  abstract getTopScorersForCompetition(
    id: CompetitionId
  ): Observable<TopScorersDTO>;
}

@Injectable()
export class AbstractedHttpTopScorersService extends HttpTopScorersService {
  BASE_URL = environment.api + 'top-scorers';

  http = inject(HttpClient);

  getTopScorersForCompetition(id: CompetitionId): Observable<TopScorersDTO> {
    const options = {
      params: new HttpParams().set('competition', id),
    };
    return this.http
      .get<TopScorersDTO>(this.BASE_URL + '/', options)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_TOP_SCORERS_SERVICE_PROVIDER = {
  provide: HttpTopScorersService,
  useClass: AbstractedHttpTopScorersService,
};
