import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';

import { GetAllFixturesDTO } from '@lib/models';
import { Observable } from 'rxjs';
import {
  HttpFixtureStatisticsService,
  HttpFixturesService,
  HttpStandingsService,
} from '../../../services';

export abstract class DatabaseService {
  abstract getAllFixturesCount(): Observable<number>;
  abstract getAllFixtureStatisticsCount(): Observable<number>;
  abstract getAllStandingsCount(): Observable<number>;
  abstract getTableData(
    sort: string,
    order: SortDirection,
    page: number,
    limit: number
  ): Observable<GetAllFixturesDTO>;
}

@Injectable()
export class AbstractedDatabaseService extends DatabaseService {
  hfs = inject(HttpFixturesService);
  hfss = inject(HttpFixtureStatisticsService);
  hss = inject(HttpStandingsService);

  getAllFixturesCount() {
    return this.hfs.getAllFixturesCount();
  }

  getAllFixtureStatisticsCount() {
    return this.hfss.getAllFixtureStatisticsCount();
  }

  getAllStandingsCount() {
    return this.hss.getAllStandingsCount();
  }

  getTableData(
    sort = '_id',
    order: SortDirection,
    page: number,
    limit: number
  ) {
    return this.hfs.getAllFixtures(sort, order, page, limit);
  }
}

export const DATABASE_SERVICE_PROVIDER = {
  provide: DatabaseService,
  useClass: AbstractedDatabaseService,
};
