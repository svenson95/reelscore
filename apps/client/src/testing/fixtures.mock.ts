import type { ExtendedFixtureDTO } from '@lib/models';

export const EXAMPLE_FIXTURE: ExtendedFixtureDTO = {
  _id: '6a033c9a3bcb29078f9860da',
  fixture: {
    id: 1544371,
    referee: 'D. Siebert',
    timezone: 'Europe/Berlin',
    date: '2026-05-30T16:00:00.000Z',
    timestamp: 1780156800,
    periods: {
      first: 1780156800,
      second: 1780160400,
    },
    venue: {
      id: null,
      name: 'Puskas Arena',
      city: 'Budapest',
    },
    status: {
      long: 'Match Finished',
      short: 'PEN',
      elapsed: 120,
      extra: null,
    },
  },
  league: {
    id: 2,
    name: 'UEFA Champions League',
    country: 'World',
    logo: 'https://media.api-sports.io/football/leagues/2.png',
    flag: '',
    season: 2025,
    round: 'Final',
  },
  teams: {
    home: {
      id: 85,
      name: 'Paris Saint Germain',
      logo: 'https://media.api-sports.io/football/teams/85.png',
      winner: true,
    },
    away: {
      id: 42,
      name: 'Arsenal',
      logo: 'https://media.api-sports.io/football/teams/42.png',
      winner: false,
    },
  },
  goals: {
    home: 1,
    away: 1,
  },
  score: {
    halftime: {
      home: 0,
      away: 1,
    },
    fulltime: {
      home: 1,
      away: 1,
    },
    extratime: {
      home: null,
      away: null,
    },
    penalty: {
      home: 4,
      away: 3,
    },
  },
  final: {
    firstLegResult: null,
    winnerOfFinal: null,
  },
  prediction: undefined,
  evaluations: undefined,
};
