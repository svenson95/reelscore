import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import type { EventDTO, RapidEventsDTO } from '@lib/models';

import { EXAMPLE_FIXTURE } from '../../../../testing/fixtures.mock';

import { HttpFixtureEventsService } from '../services';

import { EventsStore } from './events.store';

describe('EventsStore', () => {
  let store: InstanceType<typeof EventsStore>;
  const httpMock = { getFixtureEvents: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        EventsStore,
        { provide: HttpFixtureEventsService, useValue: httpMock },
      ],
    });
    store = TestBed.inject(EventsStore);
  });

  it('should calculate the score at every event without counting missed penalties', () => {
    const response$ = new Subject<RapidEventsDTO>();
    const events = [
      createEvent(10, 'home', 'Goal', 'Normal Goal'),
      createEvent(20, 'away', 'Card', 'Yellow Card'),
      createEvent(25, 'away', 'Goal', 'Missed Penalty'),
      createEvent(30, 'away', 'Goal', 'Penalty'),
    ];
    httpMock.getFixtureEvents.mockReturnValue(response$);

    store.loadEvents({ fixtureId: '42', teams: EXAMPLE_FIXTURE.teams });
    expect(store.isLoading()).toBe(true);

    response$.next(createResponse(events));

    expect(store.events()?.map(({ result }) => result)).toEqual([
      { home: 1, away: 0 },
      { home: 1, away: 0 },
      { home: 1, away: 0 },
      { home: 1, away: 1 },
    ]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should expose missing events and recover through a realtime update', () => {
    httpMock.getFixtureEvents.mockReturnValue(of(undefined));

    store.loadEvents({ fixtureId: '42', teams: EXAMPLE_FIXTURE.teams });

    expect(store.events()).toBeNull();
    expect(store.error()).toBe('Events not found');

    store.updateEvents(
      createResponse([createEvent(10, 'home', 'Goal', 'Normal Goal')]),
      EXAMPLE_FIXTURE.teams
    );

    expect(store.events()).toHaveLength(1);
    expect(store.error()).toBeNull();
  });
});

function createEvent(
  elapsed: number,
  team: 'home' | 'away',
  type: EventDTO['type'],
  detail: EventDTO['detail']
): EventDTO {
  return {
    time: { elapsed, extra: null },
    team: { ...EXAMPLE_FIXTURE.teams[team], goals: 0 },
    player: { id: elapsed, name: `Player ${elapsed}` },
    assist: { id: null, name: null },
    type,
    detail,
    comments: '',
  };
}

function createResponse(events: EventDTO[]): RapidEventsDTO {
  return {
    parameters: { fixture: 42 },
    errors: [],
    paging: { current: 1, total: 1 },
    response: events,
  };
}
