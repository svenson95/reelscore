import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { DateString } from '@app/models';
import { FixtureDTO } from '@lib/models';
import { environment } from '../../../environments/environment';

export abstract class HttpFixturesService {
  abstract getFixtures(date: DateString): Observable<FixtureDTO[]>;
}

@Injectable()
export class AbstractedHttpFixturesService extends HttpFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getFixtures(date: DateString): Observable<FixtureDTO[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<FixtureDTO[]>(this.BASE_URL + '/get', {
      params,
    });
  }
}

export const HTTP_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpFixturesService,
  useClass: AbstractedHttpFixturesService,
};
