import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable} from 'rxjs';
import { retry } from 'rxjs';

import type { SearchResult } from '@lib/models';

import { errorHandler } from '@app/shared';
import { environment } from '../../../../../../../../environments/environment';

export abstract class SearchService {
  abstract getBySearchTerm(searchTerm: string): Observable<SearchResult[]>;
}

@Injectable()
export class AbstractedSearchService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.api + 'search';

  getBySearchTerm(searchTerm: string): Observable<SearchResult[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);

    return this.http
      .get<SearchResult[]>(this.BASE_URL + '/', { params })
      .pipe(retry(errorHandler));
  }
}

export const SEARCH_SERVICE_PROVIDER = {
  provide: SearchService,
  useClass: AbstractedSearchService,
};
