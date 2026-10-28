import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';
import { shareReplay } from 'rxjs';

import type { ExtendedFixtureDTO, FixtureId } from '@reelscore-sdk/models';

import { environment } from '@app/environment';

export abstract class HttpHeadToHeadFixturesService {
  abstract getHeadToHeadFixtures(
    fixtureId: FixtureId
  ): Observable<ExtendedFixtureDTO[]>;
}

@Injectable()
export class AbstractedHttpHeadToHeadFixturesService extends HttpHeadToHeadFixturesService {
  private readonly baseUrl = environment.api + 'fixtures';
  private readonly http = inject(HttpClient);

  getHeadToHeadFixtures(
    fixtureId: FixtureId
  ): Observable<ExtendedFixtureDTO[]> {
    const params = new HttpParams().set('fixture', String(fixtureId));

    return this.http
      .get<ExtendedFixtureDTO[]>(this.baseUrl + '/head-to-head', {
        params,
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_HEAD_TO_HEAD_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpHeadToHeadFixturesService,
  useClass: AbstractedHttpHeadToHeadFixturesService,
};
