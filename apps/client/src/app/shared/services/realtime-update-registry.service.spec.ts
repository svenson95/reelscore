import { TestBed } from '@angular/core/testing';

import type { FixtureDTO, MatchTeams } from '@lib/models';

import { createRapidEvents } from '../../../testing/factories/realtime.factory';

import {
  type RealtimeUpdateTarget,
  RealtimeUpdateRegistryService,
} from './realtime-update-registry.service';

describe('RealtimeUpdateRegistryService', () => {
  let service: RealtimeUpdateRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealtimeUpdateRegistryService],
    });

    service = TestBed.inject(RealtimeUpdateRegistryService);
  });

  it('should forward fixture updates to the matching target', () => {
    const target = createTarget(123);
    const fixture = createFixture(123);

    service.register(target);

    service.updateFixture(fixture);

    expect(target.updateFixture).toHaveBeenCalledWith(fixture);
  });

  it('should not forward fixture updates to another target', () => {
    const target = createTarget(123);

    service.register(target);

    service.updateFixture(createFixture(456));

    expect(target.updateFixture).not.toHaveBeenCalled();
  });

  it('should forward event updates with the current teams', () => {
    const teams = createTeams();
    const target = createTarget(123, teams);
    const events = createRapidEvents();

    service.register(target);

    service.updateEvents(123, events);

    expect(target.getTeams).toHaveBeenCalledTimes(1);
    expect(target.updateEvents).toHaveBeenCalledWith(events, teams);
  });

  it('should not forward event updates when teams are unavailable', () => {
    const target = createTarget(123, null);

    service.register(target);

    service.updateEvents(123, createRapidEvents());

    expect(target.getTeams).toHaveBeenCalledTimes(1);
    expect(target.updateEvents).not.toHaveBeenCalled();
  });

  it('should unregister a target', () => {
    const target = createTarget(123);

    const unregister = service.register(target);

    unregister();

    service.updateFixture(createFixture(123));

    expect(target.updateFixture).not.toHaveBeenCalled();
  });

  it('should not remove a newer target when an old target unregisters', () => {
    const firstTarget = createTarget(123);
    const secondTarget = createTarget(123);

    const unregisterFirst = service.register(firstTarget);

    service.register(secondTarget);

    unregisterFirst();

    const fixture = createFixture(123);

    service.updateFixture(fixture);

    expect(firstTarget.updateFixture).not.toHaveBeenCalled();
    expect(secondTarget.updateFixture).toHaveBeenCalledWith(fixture);
  });
});

function createTarget(
  fixtureId: number,
  teams: MatchTeams | null = createTeams()
): RealtimeUpdateTarget {
  return {
    fixtureId,
    getTeams: jest.fn(() => teams),
    updateFixture: jest.fn(),
    updateEvents: jest.fn(),
  };
}

function createFixture(fixtureId: number): FixtureDTO {
  return {
    fixture: {
      id: fixtureId,
    },
  } as FixtureDTO;
}

function createTeams(): MatchTeams {
  return {
    home: {
      id: 1,
    },
    away: {
      id: 2,
    },
  } as MatchTeams;
}
