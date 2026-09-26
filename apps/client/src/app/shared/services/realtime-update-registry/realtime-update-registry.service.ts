import { Injectable } from '@angular/core';

import type {
  FixtureDTO,
  FixtureId,
  LiveFixtureEventsUpdateDTO,
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

  updateFixtures(fixtures: FixtureDTO[]): void {
    for (const fixture of fixtures) {
      const target = this.targets.get(fixture.fixture.id);

      target?.updateFixture(fixture);
    }
  }

  updateEvents(updates: LiveFixtureEventsUpdateDTO[]): void {
    for (const update of updates) {
      const events: RapidEventsDTO | undefined = update.operation.documents[0];

      if (!events) {
        continue;
      }

      const target = this.targets.get(update.fixtureId);

      if (!target) {
        continue;
      }

      const teams = target.getTeams();

      if (!teams) {
        continue;
      }

      target.updateEvents(events, teams);
    }
  }
}
