import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';
import { shareReplay } from 'rxjs';

import type { CompetitionId, TopAssistsDTO } from '@reelscore-sdk/models';

import { environment } from '@app/environment';

export abstract class HttpTopAssistsService {
  abstract getTopAssistsForCompetition(
    id: CompetitionId
  ): Observable<TopAssistsDTO | null>;
}

@Injectable()
export class AbstractedHttpTopAssistsService extends HttpTopAssistsService {
  private readonly BASE_URL = environment.api + 'top-assists';

  private readonly http = inject(HttpClient);

  getTopAssistsForCompetition(
    id: CompetitionId
  ): Observable<TopAssistsDTO | null> {
    const options = {
      params: new HttpParams().set('competition', id),
    };

    return this.http
      .get<TopAssistsDTO | null>(this.BASE_URL + '/', options)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_TOP_ASSISTS_SERVICE_PROVIDER = {
  provide: HttpTopAssistsService,
  useClass: AbstractedHttpTopAssistsService,
};
