import { TestBed } from '@angular/core/testing';

import { of, Subject, throwError } from 'rxjs';

import type { AnalysesDTO } from '@reelscore-sdk/models';

import { HttpFixtureAnalysesService } from '../data-access';

import { AnalysesStore } from './analyses.store';

describe('AnalysesStore', () => {
  let store: InstanceType<typeof AnalysesStore>;
  const httpMock = { getFixtureAnalyses: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AnalysesStore,
        { provide: HttpFixtureAnalysesService, useValue: httpMock },
      ],
    });
    store = TestBed.inject(AnalysesStore);
  });

  it('should expose loading until analyses arrive and allow resetting them', () => {
    const response$ = new Subject<AnalysesDTO>();
    const analyses = {
      playersWithStreak: { home: [], away: [] },
      homeOrAwayStrong: null,
    } as AnalysesDTO;
    httpMock.getFixtureAnalyses.mockReturnValue(response$);
    store.loadAnalyses(42);

    expect(store.isLoading()).toBe(true);

    response$.next(analyses);

    expect(store.analyses()).toBe(analyses);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();

    store.reset();
    expect(store.analyses()).toBeNull();
  });

  it('should clear stale analyses when loading fails', () => {
    const analyses = {} as AnalysesDTO;
    const error = new Error('Analyses failed');
    httpMock.getFixtureAnalyses
      .mockReturnValueOnce(of(analyses))
      .mockReturnValueOnce(throwError(() => error));

    store.loadAnalyses(42);
    store.loadAnalyses(84);

    expect(store.analyses()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(error);
  });

  it('ignores analyses responses from an earlier fixture', () => {
    const previousResponse$ = new Subject<AnalysesDTO>();
    const currentAnalyses = {
      playersWithStreak: { home: ['Current'], away: [] },
      homeOrAwayStrong: null,
    } as AnalysesDTO;
    httpMock.getFixtureAnalyses
      .mockReturnValueOnce(previousResponse$)
      .mockReturnValueOnce(of(currentAnalyses));

    store.loadAnalyses(42);
    store.loadAnalyses(84);
    previousResponse$.next({
      playersWithStreak: { home: ['Previous'], away: [] },
      homeOrAwayStrong: null,
    } as AnalysesDTO);

    expect(store.analyses()).toBe(currentAnalyses);
  });

  it('keeps existing analyses visible during a silent refresh', () => {
    const previousAnalyses = {
      playersWithStreak: { home: ['Previous'], away: [] },
      homeOrAwayStrong: null,
    } as AnalysesDTO;
    const updatedAnalyses = {
      playersWithStreak: { home: ['Updated'], away: [] },
      homeOrAwayStrong: null,
    } as AnalysesDTO;
    const refreshResponse$ = new Subject<AnalysesDTO>();
    httpMock.getFixtureAnalyses
      .mockReturnValueOnce(of(previousAnalyses))
      .mockReturnValueOnce(refreshResponse$);

    store.loadAnalyses(42);
    store.loadAnalyses(42, true);

    expect(store.analyses()).toBe(previousAnalyses);
    expect(store.isLoading()).toBe(false);

    refreshResponse$.next(updatedAnalyses);

    expect(store.analyses()).toBe(updatedAnalyses);
    expect(store.isLoading()).toBe(false);
  });
});
