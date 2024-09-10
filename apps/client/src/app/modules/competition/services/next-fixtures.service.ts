import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CompetitionId, FixtureDTO } from '@lib/models';
import { environment } from '../../../../environments/environment';

export abstract class HttpNextFixturesService {
  abstract getNextFixturesForCompetition(
    id: CompetitionId
  ): Observable<FixtureDTO[]>;
}

@Injectable()
export class AbstractedHttpNextFixturesService extends HttpNextFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getNextFixturesForCompetition(id: CompetitionId): Observable<FixtureDTO[]> {
    return this.http.get<FixtureDTO[]>(this.BASE_URL + '/get-next', {
      params: new HttpParams().set('competition', id),
    });
  }
}

export const HTTP_NEXT_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpNextFixturesService,
  useClass: AbstractedHttpNextFixturesService,
};
