import { TestBed } from '@angular/core/testing';

import type {
  FixtureDTO,
  LiveFixtureEventsUpdateDTO,
  MatchTeams,
  RapidEventsDTO,
} from '@lib/models';

import {
  createOperationResponse,
  createRapidEvents,
} from '../../../testing/factories/realtime.factory';

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

  describe('fixture updates', () => {
    it('should forward fixture updates to matching targets', () => {
      const firstTarget = createTarget(123);
      const secondTarget = createTarget(456);

      const firstFixture = createFixture(123);
      const secondFixture = createFixture(456);

      service.register(firstTarget);
      service.register(secondTarget);

      service.updateFixtures([firstFixture, secondFixture]);

      expect(firstTarget.updateFixture).toHaveBeenCalledWith(firstFixture);
      expect(secondTarget.updateFixture).toHaveBeenCalledWith(secondFixture);
    });

    it('should not forward fixture updates to another target', () => {
      const target = createTarget(123);

      service.register(target);

      service.updateFixtures([createFixture(456)]);

      expect(target.updateFixture).not.toHaveBeenCalled();
    });
  });

  describe('event updates', () => {
    it('should forward event updates with the current teams', () => {
      const teams = createTeams();
      const target = createTarget(123, teams);
      const events = createRapidEvents();

      service.register(target);

      service.updateEvents([createFixtureEventsUpdate(123, events)]);

      expect(target.getTeams).toHaveBeenCalledTimes(1);
      expect(target.updateEvents).toHaveBeenCalledWith(events, teams);
    });

    it('should forward event updates to matching targets', () => {
      const firstTeams = createTeams();
      const secondTeams = createTeams();

      const firstTarget = createTarget(123, firstTeams);
      const secondTarget = createTarget(456, secondTeams);

      const firstEvents = createRapidEvents();
      const secondEvents = createRapidEvents();

      service.register(firstTarget);
      service.register(secondTarget);

      service.updateEvents([
        createFixtureEventsUpdate(123, firstEvents),
        createFixtureEventsUpdate(456, secondEvents),
      ]);

      expect(firstTarget.updateEvents).toHaveBeenCalledWith(
        firstEvents,
        firstTeams
      );

      expect(secondTarget.updateEvents).toHaveBeenCalledWith(
        secondEvents,
        secondTeams
      );
    });

    it('should ignore event updates without a matching target', () => {
      const target = createTarget(123);

      service.register(target);

      service.updateEvents([
        createFixtureEventsUpdate(456, createRapidEvents()),
      ]);

      expect(target.getTeams).not.toHaveBeenCalled();
      expect(target.updateEvents).not.toHaveBeenCalled();
    });

    it('should not forward event updates when teams are unavailable', () => {
      const target = createTarget(123, null);

      service.register(target);

      service.updateEvents([
        createFixtureEventsUpdate(123, createRapidEvents()),
      ]);

      expect(target.getTeams).toHaveBeenCalledTimes(1);
      expect(target.updateEvents).not.toHaveBeenCalled();
    });

    it('should ignore event updates without documents', () => {
      const target = createTarget(123);

      service.register(target);

      service.updateEvents([createEmptyFixtureEventsUpdate(123)]);

      expect(target.getTeams).not.toHaveBeenCalled();
      expect(target.updateEvents).not.toHaveBeenCalled();
    });
  });

  describe('registration', () => {
    it('should unregister a target', () => {
      const target = createTarget(123);

      const unregister = service.register(target);

      unregister();

      service.updateFixtures([createFixture(123)]);

      expect(target.updateFixture).not.toHaveBeenCalled();
    });

    it('should not remove a newer target when an old target unregisters', () => {
      const firstTarget = createTarget(123);
      const secondTarget = createTarget(123);

      const unregisterFirst = service.register(firstTarget);

      service.register(secondTarget);

      unregisterFirst();

      const fixture = createFixture(123);

      service.updateFixtures([fixture]);

      expect(firstTarget.updateFixture).not.toHaveBeenCalled();
      expect(secondTarget.updateFixture).toHaveBeenCalledWith(fixture);
    });
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
