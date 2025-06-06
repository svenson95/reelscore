import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { CompetitionId, ExtendedFixtureDTO } from '@lib/models';
import { environment } from '../../../../environments/environment';

export abstract class HttpLastFixturesService {
  abstract getLastFixturesForCompetition(
    id: CompetitionId,
    showAll?: boolean
  ): Observable<ExtendedFixtureDTO[][]>;
}

@Injectable()
export class AbstractedHttpLastFixturesService extends HttpLastFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getLastFixturesForCompetition(
    id: CompetitionId,
    showAll = false
  ): Observable<ExtendedFixtureDTO[][]> {
    const options = {
      params: new HttpParams().set('competition', id).set('type', 'last'),
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

export const HTTP_LAST_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpLastFixturesService,
  useClass: AbstractedHttpLastFixturesService,
};
