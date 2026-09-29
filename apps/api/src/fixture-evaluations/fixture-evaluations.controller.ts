import type {
  EvaluationDTO,
  EvaluationTeam,
  ExtendedFixtureDTO,
  FixtureDTO,
  FixtureId,
} from '@lib/models';

import { FixtureService, FixturesService } from '../database';
import { FixtureEvaluationsService } from './fixture-evaluations.service';

export interface FixtureReader {
  findById(fixtureId: FixtureId): Promise<ExtendedFixtureDTO | null>;
}

export interface FixtureHistoryReader {
  findByFixtureAndTeamType(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): Promise<ExtendedFixtureDTO[]>;
}

export interface FixtureEvaluator {
  analyzeFixtures(
    teamId: number,
    fixtures: FixtureDTO[]
  ): Promise<EvaluationTeam>;
}

export class FixtureEvaluationsController {
  constructor(
    private readonly fixtureService: FixtureReader = new FixtureService(),
    private readonly fixturesService: FixtureHistoryReader = new FixturesService(),
    private readonly evaluationsService: FixtureEvaluator = new FixtureEvaluationsService()
  ) {}

  async getEvaluations(fixtureId: FixtureId): Promise<EvaluationDTO> {
    const fixture = await this.fixtureService.findById(fixtureId);
    if (!fixture) {
      throw new Error(`Fixture with id ${fixtureId} not found`);
    }

    const [homeLatest, awayLatest] = await Promise.all([
      this.fixturesService.findByFixtureAndTeamType(fixture, 'home'),
      this.fixturesService.findByFixtureAndTeamType(fixture, 'away'),
    ]);

    const [home, away] = await Promise.all([
      this.evaluationsService.analyzeFixtures(
        fixture.teams.home.id,
        homeLatest
      ),
      this.evaluationsService.analyzeFixtures(
        fixture.teams.away.id,
        awayLatest
      ),
    ]);

    return { fixture: fixtureId, teams: { home, away } };
  }
}
