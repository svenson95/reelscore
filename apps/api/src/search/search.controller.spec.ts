import moment from 'moment-timezone';

import { Fixtures, Teams } from '../database';

import { SearchController } from './search.controller';

describe('SearchController', () => {
  const fixtureLean = jest.fn();
  const fixtureLimit = jest.fn();
  const fixtureSort = jest.fn();
  const teamLean = jest.fn();
  const teamLimit = jest.fn();
  const teamSort = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-30T12:00:00.000Z'));
    jest.clearAllMocks();

    fixtureLean.mockResolvedValue([]);
    fixtureLimit.mockReturnValue({ lean: fixtureLean });
    fixtureSort.mockReturnValue({ limit: fixtureLimit });
    jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort: fixtureSort } as never);
    jest.spyOn(Fixtures, 'aggregate').mockReturnValue([] as never);

    teamLean.mockResolvedValue([]);
    teamLimit.mockReturnValue({ lean: teamLean });
    teamSort.mockReturnValue({ limit: teamLimit });
    jest.spyOn(Teams, 'find').mockReturnValue({ sort: teamSort } as never);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('returns the next fixture and four most recent fixtures', async () => {
    const nextFixture = { fixture: { id: 10 } };
    const recentFixtures = [
      { fixture: { id: 9 } },
      { fixture: { id: 8 } },
      { fixture: { id: 7 } },
      { _id: 'fixture-id-fallback' },
    ];
    const competition = {
      _id: 2,
      league: { id: 2, name: 'Bundesliga' },
    };
    const team = {
      _id: 'team-id',
      team: { id: 157, name: 'Bayern Munich' },
    };
    fixtureLean
      .mockResolvedValueOnce(recentFixtures)
      .mockResolvedValueOnce([nextFixture]);
    jest.spyOn(Fixtures, 'aggregate').mockReturnValue([competition] as never);
    teamLean.mockResolvedValue([team, { _id: 'team-id-fallback' }]);

    const controller = new SearchController();

    const results = await controller.getBySearchTerm('Bayern');

    const nowTimestamp = moment.utc('2026-10-30T12:00:00.000Z').unix();

    expect(Fixtures.find).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        'fixture.timestamp': { $lte: nowTimestamp },
      })
    );
    expect(Fixtures.find).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        'fixture.timestamp': { $gt: nowTimestamp },
      })
    );
    expect(fixtureSort).toHaveBeenNthCalledWith(1, {
      'fixture.timestamp': -1,
    });
    expect(fixtureSort).toHaveBeenNthCalledWith(2, {
      'fixture.timestamp': 1,
    });
    expect(fixtureLimit).toHaveBeenNthCalledWith(1, 4);
    expect(fixtureLimit).toHaveBeenNthCalledWith(2, 1);
    expect(results.map(({ id }) => id)).toEqual([
      10,
      9,
      8,
      7,
      'fixture-id-fallback',
      competition._id,
      team.team.id,
      'team-id-fallback',
    ]);
  });
});
