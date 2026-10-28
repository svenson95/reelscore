import { HttpClient, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

import { environment } from '@app/environment';

import { AbstractedHttpHeadToHeadFixturesService } from './head-to-head-fixtures.service';

describe('AbstractedHttpHeadToHeadFixturesService', () => {
  const httpMock = { get: jest.fn() };
  let service: AbstractedHttpHeadToHeadFixturesService;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AbstractedHttpHeadToHeadFixturesService,
        { provide: HttpClient, useValue: httpMock },
      ],
    });
    service = TestBed.inject(AbstractedHttpHeadToHeadFixturesService);
  });

  it('requests the direct encounters for the selected fixture', () => {
    const fixtures = [] as ExtendedFixtureDTO[];
    httpMock.get.mockReturnValue(of(fixtures));

    let result: ExtendedFixtureDTO[] | undefined;
    service.getHeadToHeadFixtures(42).subscribe((response) => {
      result = response;
    });

    expect(httpMock.get).toHaveBeenCalledWith(
      `${environment.api}fixtures/head-to-head`,
      { params: expect.any(HttpParams) }
    );
    const requestOptions = httpMock.get.mock.calls[0][1] as {
      params: HttpParams;
    };
    expect(requestOptions.params.get('fixture')).toBe('42');
    expect(result).toBe(fixtures);
  });
});
