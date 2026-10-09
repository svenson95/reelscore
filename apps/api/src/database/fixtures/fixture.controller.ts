import type {
  EvaluationPerformance,
  FixtureId,
  FixtureIdParameter,
  FixturePerformance,
  GetFixtureDTO,
  LatestFixturesDTO,
} from '@reelscore-sdk/models';

import { FixtureEvaluationsService } from '../../fixture-evaluations';
import { FixtureEventsService } from '../fixture-events';

import { FixtureService } from './fixture.service';
import { FixturesService } from './fixtures.service';

export class FixtureController {
  private readonly fixtureService = new FixtureService();
  private readonly fixturesService = new FixturesService();
  private readonly eventsService = new FixtureEventsService();
  private readonly evaluationsService = new FixtureEvaluationsService();

  async getByIdWithHighlights(fixtureId: FixtureId): Promise<GetFixtureDTO> {
    const data = await this.fixturesService.findById(fixtureId);
    const fixtureIdParameter: FixtureIdParameter = fixtureId.toString();
    const eventsDoc = await this.eventsService.findById(fixtureIdParameter);

    const highlights = this.eventsService.filterHighlights(eventsDoc?.response);
    return { data, highlights };
  }

  async getLatest(fixtureId: FixtureId): Promise<LatestFixturesDTO> {
    const fixture = await this.fixtureService.findById(fixtureId);
    if (!fixture) {
      throw new Error(`Fixture with id ${fixtureId} not found`);
    }

    const home = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      'home'
    );
    const away = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      'away'
    );

    const performancesByFixture = new Map<
      string | number,
      ReturnType<FixtureEvaluationsService['analyzeFixturePerformances']>
    >();

    const addTeamPerformances = async (fixtures: typeof home) =>
      Promise.all(
        fixtures.map(async (latestFixture) => {
          let performances = performancesByFixture.get(
            latestFixture.fixture.id
          );
          if (!performances) {
            performances =
              this.evaluationsService.analyzeFixturePerformances(latestFixture);
            performancesByFixture.set(latestFixture.fixture.id, performances);
          }

          const teamPerformances = await performances;
          const homePerformance =
            getEvaluationPerformance(teamPerformances.home) ??
            latestFixture.evaluations?.home?.performance;
          const awayPerformance =
            getEvaluationPerformance(teamPerformances.away) ??
            latestFixture.evaluations?.away?.performance;

          const evaluations =
            homePerformance && awayPerformance
              ? {
                  home: {
                    ...latestFixture.evaluations?.home,
                    performance: homePerformance,
                    analyses: latestFixture.evaluations?.home?.analyses ?? [],
                  },
                  away: {
                    ...latestFixture.evaluations?.away,
                    performance: awayPerformance,
                    analyses: latestFixture.evaluations?.away?.analyses ?? [],
                  },
                }
              : latestFixture.evaluations;

          return {
            ...latestFixture,
            evaluations,
          };
        })
      );

    const [homeWithPerformances, awayWithPerformances] = await Promise.all([
      addTeamPerformances(home),
      addTeamPerformances(away),
    ]);

    return { home: homeWithPerformances, away: awayWithPerformances };
  }
}

const getEvaluationPerformance = (
  performance: FixturePerformance
): EvaluationPerformance | undefined => {
  if (
    performance === 'HIGH' ||
    performance === 'MIDDLE' ||
    performance === 'LOW'
  ) {
    return performance;
  }

  return undefined;
};
