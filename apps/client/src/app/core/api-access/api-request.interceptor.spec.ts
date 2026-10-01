import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { apiRequestInterceptor } from './api-request.interceptor';

describe('apiRequestInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiRequestInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should apply a timeout to API requests while preserving query parameters', () => {
    const url = `${environment.api}standings/start-top-five`;

    http.get(url, { params: { date: '2026-10-01' } }).subscribe();

    const request = httpTesting.expectOne(`${url}?date=2026-10-01`);

    expect(request.request.timeout).toBe(10_000);

    request.flush([]);
  });

  it.each([5_000, 30_000])(
    'should preserve an explicitly configured timeout of %i ms',
    (timeout) => {
      const url = `${environment.api}fixtures/by-date`;

      http.get(url, { timeout }).subscribe();

      const request = httpTesting.expectOne(url);

      expect(request.request.timeout).toBe(timeout);

      request.flush([]);
    }
  );

  it('should leave asset requests unchanged', () => {
    const url = '/assets/icons/icon.svg';

    http.get(url).subscribe();

    const request = httpTesting.expectOne(url);

    expect(request.request.timeout).toBeUndefined();

    request.flush('');
  });
});
