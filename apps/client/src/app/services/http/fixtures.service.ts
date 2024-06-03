import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';

import { FixtureId, GetAllFixturesDTO, MatchDTO } from '@lib/models';

import { environment } from '../../../environments/environment';

import { DateString } from '../../models';

export abstract class HttpFixturesService {
  abstract getFixtures(date: DateString): Observable<MatchDTO[]>;
  abstract getFixtureDetails(id: FixtureId): Observable<MatchDTO>;
  abstract getAllFixtures(
    sort: string,
    order: SortDirection,
    page: number,
    limit: number
  ): Observable<GetAllFixturesDTO>;
}

@Injectable()
export class AbstractedHttpFixturesService extends HttpFixturesService {
  BASE_URL = environment.api;

  http = inject(HttpClient);

  getFixtures(date: DateString): Observable<MatchDTO[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<MatchDTO[]>(this.BASE_URL + 'fixtures/get', {
      params,
    });
  }

  getFixtureDetails(id: FixtureId): Observable<MatchDTO> {
    const params = new HttpParams().set('fixtureId', String(id));
    return this.http.get<MatchDTO>(this.BASE_URL + 'fixtures/get', { params });
  }

  getAllFixtures(
    sort: string,
    order: SortDirection,
    page: number,
    limit: number
  ): Observable<GetAllFixturesDTO> {
    const queryParams = `?sort=${sort}&order=${order}&page=${page}&limit=${limit}`;
    return this.http.get<GetAllFixturesDTO>(
      this.BASE_URL + `fixtures/get-all${queryParams}`
    );
  }
}

export const HTTP_FIXTURES_SERVICE_PROVIDER = {
  provide: HttpFixturesService,
  useClass: AbstractedHttpFixturesService,
};
