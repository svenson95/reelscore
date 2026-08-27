import { Injectable } from '@angular/core';

import type {
  FixtureDTO,
  FixtureId,
  MatchTeams,
  RapidEventsDTO,
} from '@lib/models';

export type RealtimeUpdateTarget = {
  fixtureId: FixtureId;

  getTeams: () => MatchTeams | null;

  updateFixture: (fixture: FixtureDTO) => void;

  updateEvents: (events: RapidEventsDTO, teams: MatchTeams) => void;
};

@Injectable({ providedIn: 'root' })
export class RealtimeUpdateRegistryService {
  private readonly targets = new Map<FixtureId, RealtimeUpdateTarget>();

  register(target: RealtimeUpdateTarget): () => void {
    this.targets.set(target.fixtureId, target);

    return () => {
      if (this.targets.get(target.fixtureId) !== target) {
        return;
      }

      this.targets.delete(target.fixtureId);
    };
  }

  updateFixture(fixture: FixtureDTO): void {
    const target = this.targets.get(fixture.fixture.id);

    target?.updateFixture(fixture);
  }

  updateEvents(fixtureId: FixtureId, events: RapidEventsDTO): void {
    const target = this.targets.get(fixtureId);

    if (!target) {
      return;
    }

    const teams = target.getTeams();

    if (!teams) {
      return;
    }

    target.updateEvents(events, teams);
  }
}
