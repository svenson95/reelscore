import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';

import {
  HttpFixtureStatisticsService,
  HttpFixturesService,
  HttpStandingsService,
} from '../../../services';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
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
