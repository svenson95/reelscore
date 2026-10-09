import type {
  ExtendedFixtureDTO,
  FixtureId,
  FixturePerformance,
} from '@reelscore-sdk/models';

import { FixtureEvaluationsService } from '../../fixture-evaluations';
import { FixtureEventsService } from '../fixture-events';

import { FixtureController } from './fixture.controller';
import { FixtureService } from './fixture.service';
import { FixturesService } from './fixtures.service';

const createFixture = (
  id: number,
  evaluations?: Partial<ExtendedFixtureDTO['evaluations']>
): ExtendedFixtureDTO =>
  ({
    fixture: { id, timestamp: id, status: { short: 'FT' } },
    teams: {
      home: { id: 1, name: 'Home' },
      away: { id: 2, name: 'Away' },
    },
    evaluations: evaluations as ExtendedFixtureDTO['evaluations'],
  } as ExtendedFixtureDTO);

describe(FixtureController.name, () => {
  afterEach(() => jest.restoreAllMocks());

  it('throws when the requested fixture does not exist', async () => {
    jest.spyOn(FixtureService.prototype, 'findById').mockResolvedValue(null);

    await expect(
      new FixtureController().getLatest(404 as FixtureId)
    ).rejects.toThrow('Fixture with id 404 not found');
  });

  it('adds both team performances and reuses analysis for shared fixtures', async () => {
    const sharedFixture = createFixture(11, {
      home: { performance: 'MIDDLE', analyses: [] },
    });
    const fixtureWithStoredAwayPerformance = createFixture(12, {
      away: { performance: 'LOW', analyses: [] },
    });
    const fixtureWithoutStoredPerformances = createFixture(13);

    const homeFixtures = [sharedFixture, fixtureWithStoredAwayPerformance];
    const awayFixtures = [sharedFixture, fixtureWithoutStoredPerformances];

    jest
      .spyOn(FixtureService.prototype, 'findById')
      .mockResolvedValue(createFixture(1));

    jest
      .spyOn(FixturesService.prototype, 'findByFixtureAndTeamType')
      .mockImplementation(async (_fixture, team) =>
        team === 'home' ? homeFixtures : awayFixtures
      );

    const performanceByFixture = new Map<
      number,
      { home: FixturePerformance; away: FixturePerformance }
    >([
      [11, { home: 'LOW', away: 'HIGH' }],
      [12, { home: 'MIDDLE', away: 'NO_STATISTICS_AVAILABLE' }],
      [
        13,
        {
          home: 'NO_STATISTICS_AVAILABLE',
          away: 'NO_STATISTICS_AVAILABLE',
        },
      ],
    ]);
    const analyzeFixturePerformances = jest
      .spyOn(FixtureEvaluationsService.prototype, 'analyzeFixturePerformances')
      .mockImplementation(async (fixture) => {
        const performances = performanceByFixture.get(
          fixture.fixture.id as number
        );
        if (!performances) {
          throw new Error(
            `Missing performance result for fixture ${fixture.fixture.id}`
          );
        }
        return performances;
      });

    const result = await new FixtureController().getLatest(1 as FixtureId);

    expect(analyzeFixturePerformances).toHaveBeenCalledTimes(3);
    expect(result.home[0].evaluations).toEqual({
      home: { performance: 'LOW', analyses: [] },
      away: { performance: 'HIGH', analyses: [] },
    });
    expect(result.home[1].evaluations).toEqual({
      home: { performance: 'MIDDLE', analyses: [] },
      away: { performance: 'LOW', analyses: [] },
    });
    expect(result.away[1].evaluations).toBeUndefined();
  });

  it('returns fixture highlights from the events service', async () => {
    const fixture = createFixture(42);
    const highlights = [{ type: 'Goal' }];

    jest
      .spyOn(FixturesService.prototype, 'findById')
      .mockResolvedValue(fixture);
    jest
      .spyOn(FixtureEventsService.prototype, 'findById')
      .mockResolvedValue({ response: [] } as never);
    jest
      .spyOn(FixtureEventsService.prototype, 'filterHighlights')
      .mockReturnValue(highlights as never);

    await expect(
      new FixtureController().getByIdWithHighlights(42 as FixtureId)
    ).resolves.toEqual({ data: fixture, highlights });
  });
});
