import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { CompetitionId, ExtendedFixtureDTO } from '@lib/models';
import { environment } from '../../../../environments/environment';

export abstract class HttpNextFixturesService {
  abstract getNextFixturesForCompetition(
    id: CompetitionId,
    showAll?: boolean
  ): Observable<ExtendedFixtureDTO[][]>;
}

@Injectable()
export class AbstractedHttpNextFixturesService extends HttpNextFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getNextFixturesForCompetition(
    id: CompetitionId,
    showAll = false
  ): Observable<ExtendedFixtureDTO[][]> {
    const options = {
      params: new HttpParams().set('competition', id).set('type', 'next'),
    };
    if (showAll) options.params = options.params.set('showAll', 'true');
    return this.http
      .get<ExtendedFixtureDTO[][]>(
        this.BASE_URL + '/competition-fixtures',
        options
      )
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_NEXT_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpNextFixturesService,
  useClass: AbstractedHttpNextFixturesService,
};
