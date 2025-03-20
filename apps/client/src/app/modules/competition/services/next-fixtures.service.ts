import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CompetitionId, FixtureDTO } from '@lib/models';
import { environment } from '../../../../environments/environment';

export abstract class HttpNextFixturesService {
  abstract getNextFixturesForCompetition(
    id: CompetitionId,
    showAll?: boolean
  ): Observable<FixtureDTO[][]>;
}

@Injectable()
export class AbstractedHttpNextFixturesService extends HttpNextFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getNextFixturesForCompetition(
    id: CompetitionId,
    showAll = false
  ): Observable<FixtureDTO[][]> {
    const options = {
      params: new HttpParams().set('competition', id).set('type', 'next'),
    };
    if (showAll) options.params = options.params.set('showAll', 'true');
    return this.http.get<FixtureDTO[][]>(
      this.BASE_URL + '/competition-fixtures',
      options
    );
  }
}

export const HTTP_NEXT_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpNextFixturesService,
  useClass: AbstractedHttpNextFixturesService,
};
