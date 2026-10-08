import { TestBed } from '@angular/core/testing';

import { of, Subject } from 'rxjs';

import type { RapidStatisticsDTO, StatisticDTO } from '@reelscore-sdk/models';

import { HttpFixtureStatisticsService } from '../data-access';

import { StatisticsStore } from './statistics.store';

describe('StatisticsStore', () => {
  let store: InstanceType<typeof StatisticsStore>;
  const httpMock = { getFixtureStatistics: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        StatisticsStore,
        { provide: HttpFixtureStatisticsService, useValue: httpMock },
      ],
    });
    store = TestBed.inject(StatisticsStore);
  });

  it('should expose loading until statistics arrive', () => {
    const response$ = new Subject<RapidStatisticsDTO>();
    const statistics = [
      {
        team: { id: 1, name: 'Home', logo: '' },
        statistics: [],
      },
    ] satisfies StatisticDTO[];
    httpMock.getFixtureStatistics.mockReturnValue(response$);
    store.loadStatistics('42');

    expect(store.isLoading()).toBe(true);

    response$.next(createResponse(statistics));

    expect(store.statistics()).toBe(statistics);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should expose an empty API response as missing statistics', () => {
    httpMock.getFixtureStatistics.mockReturnValue(of(null));
    store.loadStatistics('42');

    expect(store.statistics()).toBeUndefined();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('Statistics not found');
  });
});

function createResponse(statistics: StatisticDTO[]): RapidStatisticsDTO {
  return {
    parameters: { fixture: 42 },
    errors: [],
    paging: { current: 1, total: 1 },
    response: statistics,
  };
}
