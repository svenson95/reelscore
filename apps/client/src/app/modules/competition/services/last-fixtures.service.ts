import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CompetitionId, FixtureDTO } from '@lib/models';
import { environment } from '../../../../environments/environment';

export abstract class HttpLastFixturesService {
  abstract getLastFixturesForCompetition(
    id: CompetitionId,
    showAll: boolean
  ): Observable<FixtureDTO[][]>;
}

@Injectable()
export class AbstractedHttpLastFixturesService extends HttpLastFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getLastFixturesForCompetition(
    id: CompetitionId,
    showAll = false
  ): Observable<FixtureDTO[][]> {
    const options = { params: new HttpParams().set('competition', id) };
    if (showAll) options.params = options.params.set('showAll', 'true');
    return this.http.get<FixtureDTO[][]>(this.BASE_URL + '/get-last', options);
  }
}

export const HTTP_LAST_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpLastFixturesService,
  useClass: AbstractedHttpLastFixturesService,
};
