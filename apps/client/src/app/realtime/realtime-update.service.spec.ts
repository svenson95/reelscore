import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type {
  FixtureDTO,
  LiveFixtureEventsUpdateDTO,
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

  const fixtureUpdate = signal<LiveFixtureUpdateDTO | null>(null);

  const fixtureEventsUpdate = signal<LiveFixtureEventsUpdateDTO | null>(null);

  const realtimeServiceMock = {
    fixtureUpdate,
    fixtureEventsUpdate,
  };

  const updateRegistryMock = {
    updateFixture: jest.fn(),
    updateEvents: jest.fn(),
  };

  const weekFixturesStoreMock = {
    updateFixture: jest.fn(),
  };

  beforeEach(() => {
    fixtureUpdate.set(null);
    fixtureEventsUpdate.set(null);

    updateRegistryMock.updateFixture.mockClear();
    updateRegistryMock.updateEvents.mockClear();
    weekFixturesStoreMock.updateFixture.mockClear();

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

  it('should forward fixture updates to overview and realtime registry', () => {
    const fixture = createFixture(123);

    service.init();

    fixtureUpdate.set(createFixtureUpdate(fixture));

    TestBed.tick();

    expect(weekFixturesStoreMock.updateFixture).toHaveBeenCalledWith(fixture);

    expect(updateRegistryMock.updateFixture).toHaveBeenCalledWith(fixture);
  });

  it('should forward fixture events updates to realtime registry', () => {
    const events = createRapidEvents();

    service.init();

    fixtureEventsUpdate.set(createFixtureEventsUpdate(123, events));

    TestBed.tick();

    expect(updateRegistryMock.updateEvents).toHaveBeenCalledWith(123, events);
  });

  it('should ignore fixture updates without documents', () => {
    service.init();

    fixtureUpdate.set(createEmptyFixtureUpdate(123));

    TestBed.tick();

    expect(weekFixturesStoreMock.updateFixture).not.toHaveBeenCalled();
    expect(updateRegistryMock.updateFixture).not.toHaveBeenCalled();
  });

  it('should ignore fixture events updates without documents', () => {
    service.init();

    fixtureEventsUpdate.set(createEmptyFixtureEventsUpdate(123));

    TestBed.tick();

    expect(updateRegistryMock.updateEvents).not.toHaveBeenCalled();
  });

  it('should initialize update effects only once', () => {
    const fixture = createFixture(123);

    service.init();
    service.init();

    fixtureUpdate.set(createFixtureUpdate(fixture));

    TestBed.tick();

    expect(weekFixturesStoreMock.updateFixture).toHaveBeenCalledTimes(1);
    expect(updateRegistryMock.updateFixture).toHaveBeenCalledTimes(1);
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

function createEmptyFixtureEventsUpdate(
  fixtureId: number
): LiveFixtureEventsUpdateDTO {
  return {
    fixtureId,
    operation: createOperationResponse<RapidEventsDTO>([]),
  };
}
