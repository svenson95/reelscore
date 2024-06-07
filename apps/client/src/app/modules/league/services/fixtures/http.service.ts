import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MatchDTO } from '@lib/models';

import { DateString } from '@app/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixturesService {
  abstract getFixtures(date: DateString): Observable<MatchDTO[]>;
}

@Injectable()
export class AbstractedHttpFixturesService extends HttpFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getFixtures(date: DateString): Observable<MatchDTO[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<MatchDTO[]>(this.BASE_URL + '/get', {
      params,
    });
  }
}

export const HTTP_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpFixturesService,
  useClass: AbstractedHttpFixturesService,
};
