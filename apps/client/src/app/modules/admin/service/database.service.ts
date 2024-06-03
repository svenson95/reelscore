import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';

import { HttpFixturesService } from '../../../services';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  http = inject(HttpFixturesService);

  getTableData(
    sort = '_id',
    order: SortDirection,
    page: number,
    limit: number
  ) {
    return this.http.getAllFixtures(sort, order, page, limit);
  }
}
