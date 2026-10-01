import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import type { RapidEventsDTO } from '@reelscore-sdk/models';

import { AbstractedHttpFixtureEventsService } from './events.service';

describe('AbstractedHttpFixtureEventsService', () => {
  const httpMock = { get: jest.fn() };

  let service: AbstractedHttpFixtureEventsService;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AbstractedHttpFixtureEventsService,
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(AbstractedHttpFixtureEventsService);
  });

  it('should expose a missing API response as undefined', () => {
    let result: RapidEventsDTO | undefined;
    httpMock.get.mockReturnValue(of(null));

    service.getFixtureEvents('42').subscribe((events) => {
      result = events;
    });

    expect(result).toBeUndefined();
  });
});
