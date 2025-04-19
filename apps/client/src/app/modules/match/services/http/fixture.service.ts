import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { FixtureId, GetFixtureDTO } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureService {
  abstract getFixture(id: FixtureId): Observable<GetFixtureDTO>;
}

@Injectable()
export class AbstractedHttpFixtureService extends HttpFixtureService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getFixture(id: FixtureId): Observable<GetFixtureDTO> {
    const params = new HttpParams().set('fixture', String(id));
    return this.http
      .get<GetFixtureDTO>(this.BASE_URL + '/by-id', {
        params,
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_FIXTURE_SERVICE_PROVIDER = {
  provide: HttpFixtureService,
  useClass: AbstractedHttpFixtureService,
};
