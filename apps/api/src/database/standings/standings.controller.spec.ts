import type { StandingRanks, StandingsDTO } from '@reelscore-sdk/models';

import {
  StandingsController,
  type StandingsReader,
} from './standings.controller';

describe(StandingsController.name, () => {
  it('passes only the conference source tables to the frontend for MLS fixtures', async () => {
    const reader = createStandingsReader();
    const controller = new StandingsController(reader);

    const result = await controller.getFixtureStandings(
      '100,101',
      253,
      '2026-10-30'
    );

    expect(result?.league.standings.map((group) => group[0].group)).toEqual([
      'Eastern Conference',
      'Western Conference',
    ]);
    expect(result?.league.standings).toHaveLength(2);
  });

  it('deduplicates legacy MLS groups for interconference fixtures', async () => {
    const reader = createStandingsReader();
    const controller = new StandingsController(reader);

    const result = await controller.getFixtureStandings(
      '100,200',
      253,
      '2026-10-30'
    );

    expect(result?.league.standings).toHaveLength(2);
  });
});

function createStandingsReader(): StandingsReader {
  const easternStandings = Array.from({ length: 15 }, (_, index) =>
    createStanding(100 + index, 'Eastern Conference')
  );
  const westernStandings = Array.from({ length: 15 }, (_, index) =>
    createStanding(200 + index, 'Western Conference')
  );
  const standings: StandingsDTO = {
    _id: 'standings-id',
    league: {
      id: 253,
      name: 'Major League Soccer',
      country: 'USA',
      logo: '',
      flag: null,
      season: 2026,
      standings: [
        westernStandings,
        easternStandings,
        [...westernStandings],
        [...westernStandings],
      ],
    },
    createdAt: new Date('2026-10-30T00:00:00Z'),
    updatedAt: new Date('2026-10-30T00:00:00Z'),
  };

  return {
    findByFilter: jest.fn().mockResolvedValue(standings),
  };
}

function createStanding(teamId: number, group: string): StandingRanks {
  const stats = {
    played: 0,
    win: 0,
    draw: 0,
    lose: 0,
    goals: { for: 0, against: 0 },
  };

  return {
    rank: 1,
    team: { id: teamId, name: `Team ${teamId}`, logo: '' },
    points: 0,
    goalsDiff: 0,
    group,
    form: null,
    status: 'same',
    description: null,
    all: stats,
    home: stats,
    away: stats,
    update: '2026-10-30T00:00:00Z',
  };
}
