import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type {
  FixtureDTO,
  LiveFixtureEventsBatchUpdateDTO,
  LiveFixtureEventsUpdateDTO,
  LiveFixturesUpdateDTO,
  LiveFixtureUpdateDTO,
  RapidEventsDTO,
} from '@lib/models';

import {
  createOperationResponse,
  createRapidEvents,
} from '../../testing/factories/realtime.factory';
import { WeekFixturesStore } from '../features/overview/stores';
import { RealtimeUpdateRegistryService } from '../shared/services/realtime-update-registry.service';
import { RealtimeService } from '../shared/services/realtime.service';

import { RealtimeUpdateService } from './realtime-update.service';

describe('RealtimeUpdateService', () => {
  let service: RealtimeUpdateService;

  const fixturesUpdate = signal<LiveFixturesUpdateDTO | null>(null);

  const fixtureEventsUpdate = signal<LiveFixtureEventsBatchUpdateDTO | null>(
    null
  );

  const realtimeServiceMock = {
    fixturesUpdate,
    fixtureEventsUpdate,
  };

  const updateRegistryMock = {
    updateFixtures: jest.fn(),
    updateEvents: jest.fn(),
  };

  const weekFixturesStoreMock = {
    updateFixtures: jest.fn(),
  };

  beforeEach(() => {
    fixturesUpdate.set(null);
    fixtureEventsUpdate.set(null);

    updateRegistryMock.updateFixtures.mockClear();
    updateRegistryMock.updateEvents.mockClear();
    weekFixturesStoreMock.updateFixtures.mockClear();

    TestBed.configureTestingModule({
      providers: [
        RealtimeUpdateService,
        {
          provide: RealtimeService,
          useValue: realtimeServiceMock,
        },
        {
          provide: RealtimeUpdateRegistryService,
          useValue: updateRegistryMock,
        },
        {
          provide: WeekFixturesStore,
          useValue: weekFixturesStoreMock,
        },
      ],
    });

    service = TestBed.inject(RealtimeUpdateService);
  });

  it('should forward fixture batches to overview and realtime registry', () => {
    const fixtures = [createFixture(123), createFixture(456)];

    service.init();

    fixturesUpdate.set(createFixturesUpdate(fixtures));

    TestBed.tick();

    expect(weekFixturesStoreMock.updateFixtures).toHaveBeenCalledWith(fixtures);

    expect(updateRegistryMock.updateFixtures).toHaveBeenCalledWith(fixtures);
  });

  it('should forward fixture events batches to realtime registry', () => {
    const firstEvents = createRapidEvents();
    const secondEvents = createRapidEvents();

    const updates = [
      createFixtureEventsUpdate(123, firstEvents),
      createFixtureEventsUpdate(456, secondEvents),
    ];

    service.init();

    fixtureEventsUpdate.set({
      updates,
    });

    TestBed.tick();

    expect(updateRegistryMock.updateEvents).toHaveBeenCalledWith(updates);
  });

  it('should ignore fixture batches without documents', () => {
    service.init();

    fixturesUpdate.set({
      updates: [createEmptyFixtureUpdate(123), createEmptyFixtureUpdate(456)],
    });

    TestBed.tick();

    expect(weekFixturesStoreMock.updateFixtures).not.toHaveBeenCalled();
    expect(updateRegistryMock.updateFixtures).not.toHaveBeenCalled();
  });

  it('should forward only fixture updates with documents', () => {
    const fixture = createFixture(123);

    service.init();

    fixturesUpdate.set({
      updates: [createFixtureUpdate(fixture), createEmptyFixtureUpdate(456)],
    });

    TestBed.tick();

    expect(weekFixturesStoreMock.updateFixtures).toHaveBeenCalledWith([
      fixture,
    ]);

    expect(updateRegistryMock.updateFixtures).toHaveBeenCalledWith([fixture]);
  });

  it('should initialize update effects only once', () => {
    const fixture = createFixture(123);

    service.init();
    service.init();

    fixturesUpdate.set(createFixturesUpdate([fixture]));

    TestBed.tick();

    expect(weekFixturesStoreMock.updateFixtures).toHaveBeenCalledTimes(1);
    expect(updateRegistryMock.updateFixtures).toHaveBeenCalledTimes(1);
  });
});

function createFixture(fixtureId: number): FixtureDTO {
  return {
    fixture: {
      id: fixtureId,
    },
  } as FixtureDTO;
}

function createFixtureUpdate(fixture: FixtureDTO): LiveFixtureUpdateDTO {
  return {
    fixtureId: fixture.fixture.id,
    operation: createOperationResponse<FixtureDTO>([fixture]),
  };
}

function createFixturesUpdate(fixtures: FixtureDTO[]): LiveFixturesUpdateDTO {
  return {
    updates: fixtures.map(createFixtureUpdate),
  };
}

function createEmptyFixtureUpdate(fixtureId: number): LiveFixtureUpdateDTO {
  return {
    fixtureId,
    operation: createOperationResponse<FixtureDTO>([]),
  };
}

function createFixtureEventsUpdate(
  fixtureId: number,
  events: RapidEventsDTO
): LiveFixtureEventsUpdateDTO {
  return {
    fixtureId,
    operation: createOperationResponse<RapidEventsDTO>([events]),
  };
}
