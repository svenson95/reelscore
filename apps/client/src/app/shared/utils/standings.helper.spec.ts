import type { StandingRanks, StandingsDTO } from '@reelscore-sdk/models';

import { getStandingsGroups } from './standings.helper';

describe('getStandingsGroups', () => {
  it('builds one MLS table from the two conference tables and drops duplicates', () => {
    const easternConference = [
      createStanding(100, 'Nashville', 'Eastern Conference', 30, 9, 25, 10),
      createStanding(101, 'Miami', 'Eastern Conference', 25, 7, 22, 12),
    ];
    const westernConference = [
      createStanding(200, 'Vancouver', 'Western Conference', 28, 8, 24, 11),
      createStanding(201, 'Dallas', 'Western Conference', 20, 6, 18, 13),
    ];

    const result = getStandingsGroups(
      createStandings([
        westernConference,
        easternConference,
        [...westernConference],
        [...westernConference],
      ])
    );

    expect(result.map((group) => group[0].group)).toEqual([
      'Eastern Conference',
      'Western Conference',
      'MLS',
    ]);
    expect(result[0]).toHaveLength(2);
    expect(result[1]).toHaveLength(2);
    expect(result[2].map(({ team, rank }) => [team.name, rank])).toEqual([
      ['Nashville', 1],
      ['Vancouver', 2],
      ['Miami', 3],
      ['Dallas', 4],
    ]);
  });

  it('shows the match conference together with MLS standings on a match page', () => {
    const easternConference = [
      createStanding(100, 'Nashville', 'Eastern Conference', 30, 9, 25, 10),
    ];
    const westernConference = [
      createStanding(200, 'Vancouver', 'Western Conference', 28, 8, 24, 11),
      createStanding(201, 'Dallas', 'Western Conference', 20, 6, 18, 13),
    ];

    const result = getStandingsGroups(
      createStandings([easternConference, westernConference]),
      200,
      201
    );

    expect(result.map((group) => group[0].group)).toEqual([
      'Western Conference',
      'MLS',
    ]);
    expect(result[0].map(({ team }) => team.name)).toEqual([
      'Vancouver',
      'Dallas',
    ]);
    expect(result[1].map(({ team, rank }) => [team.name, rank])).toEqual([
      ['Vancouver', 2],
      ['Dallas', 3],
    ]);
  });

  it('shows each conference participant and the MLS table for an interconference match', () => {
    const easternConference = [
      createStanding(100, 'Nashville', 'Eastern Conference', 30, 9, 25, 10),
    ];
    const westernConference = [
      createStanding(200, 'Vancouver', 'Western Conference', 28, 8, 24, 11),
    ];

    const result = getStandingsGroups(
      createStandings([easternConference, westernConference]),
      100,
      200
    );

    expect(result.map((group) => group[0].group)).toEqual([
      'Eastern Conference',
      'Western Conference',
      'MLS',
    ]);
    expect(result[0].map(({ team }) => team.name)).toEqual(['Nashville']);
    expect(result[1].map(({ team }) => team.name)).toEqual(['Vancouver']);
    expect(result[2].map(({ team }) => team.name)).toEqual([
      'Nashville',
      'Vancouver',
    ]);
  });

  it('keeps one available conference table when the other conference is missing', () => {
    const westernConference = [
      createStanding(200, 'Vancouver', 'Western Conference', 28, 8, 24, 11),
    ];

    const result = getStandingsGroups(
      createStandings([
        westernConference,
        [...westernConference],
        [],
        [createStanding(300, 'Other', 'Other Group', 10, 3, 12, 9)],
      ])
    );

    expect(result).toEqual([westernConference]);
  });

  it('leaves non-MLS standings unchanged', () => {
    const groups = [
      [createStanding(1, 'Team A', 'Group A', 1, 0, 0, 0)],
      [createStanding(2, 'Team B', 'Group B', 1, 0, 0, 0)],
    ];

    expect(getStandingsGroups(createStandings(groups, 2))).toBe(groups);
  });
});

function createStandings(
  groups: StandingRanks[][],
  competitionId = 253
): StandingsDTO {
  return {
    _id: 'standings-id',
    league: {
      id: competitionId,
      name: competitionId === 253 ? 'Major League Soccer' : 'Test League',
      country: 'USA',
      logo: '',
      flag: null,
      season: 2026,
      standings: groups,
    },
    createdAt: new Date('2026-10-30T00:00:00Z'),
    updatedAt: new Date('2026-10-30T00:00:00Z'),
  };
}

function createStanding(
  teamId: number,
  name: string,
  group: string,
  points: number,
  wins: number,
  goalsFor: number,
  goalsAgainst: number
): StandingRanks {
  const played = {
    played: 10,
    win: wins,
    draw: 0,
    lose: 10 - wins,
    goals: { for: goalsFor, against: goalsAgainst },
  };

  return {
    rank: 1,
    team: { id: teamId, name, logo: '' },
    points,
    goalsDiff: goalsFor - goalsAgainst,
    group,
    form: null,
    status: 'same',
    description: null,
    all: played,
    home: played,
    away: played,
    update: '2026-10-30T00:00:00Z',
  };
}
