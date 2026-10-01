import type {
  EvaluationTeam,
  ExtendedFixtureDTO,
  FixtureDTO,
} from '@reelscore-sdk/models';

import {
  FixtureEvaluationsController,
  type FixtureEvaluator,
  type FixtureHistoryReader,
  type FixtureReader,
} from './fixture-evaluations.controller';

const evaluation: EvaluationTeam = {
  performances: ['HIGH'],
  results: ['WIN'],
};

describe(FixtureEvaluationsController.name, () => {
  it('fails explicitly when the fixture does not exist', async () => {
    const fixtureReader: FixtureReader = {
      findById: jest.fn().mockResolvedValue(null),
    };
    const historyReader = {} as FixtureHistoryReader;
    const evaluator = {} as FixtureEvaluator;

    await expect(
      new FixtureEvaluationsController(
        fixtureReader,
        historyReader,
        evaluator
      ).getEvaluations(404)
    ).rejects.toThrow('Fixture with id 404 not found');
  });

  it('loads and evaluates both teams', async () => {
    const fixture = {
      teams: { home: { id: 1 }, away: { id: 2 } },
    } as ExtendedFixtureDTO;
    const homeFixtures = [{}] as FixtureDTO[];
    const awayFixtures = [{}, {}] as FixtureDTO[];
    const fixtureReader: FixtureReader = {
      findById: jest.fn().mockResolvedValue(fixture),
    };
    const historyReader: FixtureHistoryReader = {
      findByFixtureAndTeamType: jest
        .fn()
        .mockResolvedValueOnce(homeFixtures)
        .mockResolvedValueOnce(awayFixtures),
    };
    const evaluator: FixtureEvaluator = {
      analyzeFixtures: jest.fn().mockResolvedValue(evaluation),
    };

    const result = await new FixtureEvaluationsController(
      fixtureReader,
      historyReader,
      evaluator
    ).getEvaluations(42);

    expect(historyReader.findByFixtureAndTeamType).toHaveBeenCalledWith(
      fixture,
      'home'
    );
    expect(historyReader.findByFixtureAndTeamType).toHaveBeenCalledWith(
      fixture,
      'away'
    );
    expect(evaluator.analyzeFixtures).toHaveBeenCalledWith(1, homeFixtures);
    expect(evaluator.analyzeFixtures).toHaveBeenCalledWith(2, awayFixtures);
    expect(result).toEqual({
      fixture: 42,
      teams: { home: evaluation, away: evaluation },
    });
  });
});
