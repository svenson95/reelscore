import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { FixturesWeekData } from '@lib/models';

import { environment } from '../../../../environments/environment';
import { DateString } from '../../constants';

export abstract class HttpWeekFixturesService {
  abstract getWeekFixtures(date: DateString): Observable<FixturesWeekData>;
}

@Injectable()
export class AbstractedHttpWeekFixturesService extends HttpWeekFixturesService {
  BASE_URL = environment.api + 'fixtures';

  http = inject(HttpClient);

  getWeekFixtures(date: DateString): Observable<FixturesWeekData> {
    const params = new HttpParams().set('date', date);
    return this.http
      .get<FixturesWeekData>(this.BASE_URL + '/by-date', {
        params,
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_WEEK_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpWeekFixturesService,
  useClass: AbstractedHttpWeekFixturesService,
};
