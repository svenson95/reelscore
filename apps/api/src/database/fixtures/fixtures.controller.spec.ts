import {
  COMPETITION_ROUNDS,
  STATUS_VALUES_PLAYING,
} from '@reelscore-sdk/constants';
import type { CompetitionId } from '@reelscore-sdk/models';

import { FixturesController } from './fixtures.controller';
import { Fixtures } from './fixtures.model';

describe('FixturesController competition fixtures', () => {
  afterEach(() => jest.restoreAllMocks());

  it('includes live matches in the recent results query', async () => {
    const lean = jest.fn().mockResolvedValue([]);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    await new FixturesController().competitionFixtures(
      'last',
      10 as CompetitionId,
      false
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.arrayContaining([
          expect.objectContaining({
            'fixture.status.short': { $in: STATUS_VALUES_PLAYING },
          }),
        ]),
      })
    );
  });

  it('excludes live matches from the upcoming fixtures query', async () => {
    const lean = jest.fn().mockResolvedValue([]);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    await new FixturesController().competitionFixtures(
      'next',
      10 as CompetitionId,
      false
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        $and: expect.arrayContaining([
          expect.objectContaining({
            'fixture.status.short': {
              $nin: expect.arrayContaining(STATUS_VALUES_PLAYING),
            },
          }),
        ]),
      })
    );
  });

  it('loads only the latest three matchdays by default', async () => {
    const competitionId = 140 as CompetitionId;
    const seasonRounds = Object.values(
      COMPETITION_ROUNDS[2026]?.[competitionId] ?? {}
    );
    const selectedRound = seasonRounds[4];
    if (!selectedRound) throw new Error('Expected La Liga rounds for 2026');
    const selectedRoundIndex = seasonRounds.indexOf(selectedRound);
    const roundIdentifiers = new Set<string>();

    for (
      let index = selectedRoundIndex;
      index >= 0 && roundIdentifiers.size < 3;
      index -= 1
    ) {
      roundIdentifiers.add(
        seasonRounds[index].match(/\d+$/)?.[0] ?? seasonRounds[index]
      );
    }
    const expectedRounds = seasonRounds.filter((round) =>
      roundIdentifiers.has(round.match(/\d+$/)?.[0] ?? round)
    );

    const leanLatestRound = jest.fn().mockResolvedValue({
      league: { round: selectedRound },
    });
    const sortLatestRound = jest
      .fn()
      .mockReturnValue({ lean: leanLatestRound });
    jest
      .spyOn(Fixtures, 'findOne')
      .mockReturnValue({ sort: sortLatestRound } as never);

    const fixtures = [
      { league: { round: selectedRound } },
      { league: { round: expectedRounds[0] } },
    ];
    const lean = jest.fn().mockResolvedValue(fixtures as never);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    const result = await new FixturesController().competitionFixtures(
      'last',
      competitionId,
      false
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        'league.round': { $in: expectedRounds },
      })
    );
    expect(result.map((group) => group[0]?.league.round)).toEqual([
      selectedRound,
      expectedRounds[0],
    ]);
  });

  it('loads every scheduled round when show-all is requested', async () => {
    const competitionId = 140 as CompetitionId;
    const seasonRounds = Object.values(
      COMPETITION_ROUNDS[2026]?.[competitionId] ?? {}
    );
    const selectedRound = seasonRounds[4];
    if (!selectedRound) throw new Error('Expected La Liga rounds for 2026');

    const leanLatestRound = jest.fn().mockResolvedValue({
      league: { round: selectedRound },
    });
    const sortLatestRound = jest
      .fn()
      .mockReturnValue({ lean: leanLatestRound });
    jest
      .spyOn(Fixtures, 'findOne')
      .mockReturnValue({ sort: sortLatestRound } as never);

    const fixtures = [
      { league: { round: selectedRound } },
      { league: { round: seasonRounds[3] } },
    ];
    const lean = jest.fn().mockResolvedValue(fixtures as never);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    const result = await new FixturesController().competitionFixtures(
      'last',
      competitionId,
      true
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        'league.round': { $in: seasonRounds },
      })
    );
    expect(result.map((group) => group[0]?.league.round)).toEqual([
      selectedRound,
      seasonRounds[3],
    ]);
  });

  it('loads and groups all upcoming rounds in single-group competitions', async () => {
    const competitionId = 140 as CompetitionId;
    const seasonRounds = Object.values(
      COMPETITION_ROUNDS[2026]?.[competitionId] ?? {}
    );
    const upcomingRounds = seasonRounds.slice(2, 5);
    const selectedRound = upcomingRounds[0];
    if (!selectedRound) throw new Error('Expected La Liga round 2 for 2026');

    const leanUpcomingRound = jest.fn().mockResolvedValue({
      league: { round: selectedRound },
    });
    const sortUpcomingRound = jest
      .fn()
      .mockReturnValue({ lean: leanUpcomingRound });
    jest
      .spyOn(Fixtures, 'findOne')
      .mockReturnValue({ sort: sortUpcomingRound } as never);

    const fixtures = upcomingRounds.map((round) => ({ league: { round } }));
    const lean = jest.fn().mockResolvedValue(fixtures as never);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    const result = await new FixturesController().competitionFixtures(
      'next',
      competitionId,
      false
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        'league.round': { $in: seasonRounds },
      })
    );
    expect(result).toEqual(fixtures.map((fixture) => [fixture]));
  });

  it('loads all group rounds for upcoming fixtures in the same matchday', async () => {
    const competitionId = 4 as CompetitionId;
    const seasonRounds = Object.values(
      COMPETITION_ROUNDS[2026]?.[competitionId] ?? {}
    );
    const selectedRound = seasonRounds.find((round) => round === 'Group A - 1');
    if (!selectedRound) throw new Error('Expected a grouped cup matchday');

    const leanUpcomingRound = jest.fn().mockResolvedValue({
      league: { round: selectedRound },
    });
    const sortUpcomingRound = jest
      .fn()
      .mockReturnValue({ lean: leanUpcomingRound });
    jest
      .spyOn(Fixtures, 'findOne')
      .mockReturnValue({ sort: sortUpcomingRound } as never);

    const lean = jest.fn().mockResolvedValue([]);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    await new FixturesController().competitionFixtures(
      'next',
      competitionId,
      false
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        'league.round': { $in: seasonRounds },
      })
    );
  });

  it('loads a selected result round when it is missing from the schedule', async () => {
    const competitionId = 140 as CompetitionId;
    const selectedRound = 'Unscheduled Round';
    const leanLatestRound = jest.fn().mockResolvedValue({
      league: { round: selectedRound },
    });
    const sortLatestRound = jest
      .fn()
      .mockReturnValue({ lean: leanLatestRound });
    jest
      .spyOn(Fixtures, 'findOne')
      .mockReturnValue({ sort: sortLatestRound } as never);

    const lean = jest.fn().mockResolvedValue([]);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    await new FixturesController().competitionFixtures(
      'last',
      competitionId,
      false
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        'league.round': { $in: [selectedRound] },
      })
    );
  });
});
