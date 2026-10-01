import { TestBed } from '@angular/core/testing';

import { of, Subject, throwError } from 'rxjs';

import type { EvaluationDTO } from '@reelscore-sdk/models';

import { HttpEvaluationsService } from '../services';

import { EvaluationsStore } from './evaluations.store';

describe('EvaluationsStore', () => {
  let store: InstanceType<typeof EvaluationsStore>;
  const httpMock = { getEvaluations: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        EvaluationsStore,
        { provide: HttpEvaluationsService, useValue: httpMock },
      ],
    });
    store = TestBed.inject(EvaluationsStore);
  });

  it('should expose loading until evaluations arrive and allow resetting them', () => {
    const response$ = new Subject<EvaluationDTO>();
    const evaluations = {
      fixture: 42,
      teams: {
        home: { performances: [], results: [] },
        away: { performances: [], results: [] },
      },
    } satisfies EvaluationDTO;
    httpMock.getEvaluations.mockReturnValue(response$);
    store.loadEvaluations(42);

    expect(store.isLoading()).toBe(true);

    response$.next(evaluations);

    expect(store.evaluations()).toBe(evaluations);
    expect(store.isLoading()).toBe(false);

    store.reset();

    expect(store.evaluations()).toBeNull();
  });

  it('should clear stale evaluations when loading fails', () => {
    const evaluations = {} as EvaluationDTO;
    const error = new Error('Evaluations failed');
    httpMock.getEvaluations
      .mockReturnValueOnce(of(evaluations))
      .mockReturnValueOnce(throwError(() => error));

    store.loadEvaluations(42);
    store.loadEvaluations(84);

    expect(store.evaluations()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(error);
  });
});
