import type { TopScorer } from '@reelscore-sdk/models';

import { getAssistProviders, getGoalScorers } from './player-statistics.utils';

describe('competition player statistics', () => {
  it('ranks scorers by goals and excludes players without a goal', () => {
    const players = [
      createTopScorer(1, 2, 4, 0, 180),
      createTopScorer(2, 4, 1, 1, 300),
      createTopScorer(3, 0, 8, 0, 90),
    ];

    expect(getGoalScorers(players).map(({ player }) => player.id)).toEqual([
      2, 1,
    ]);
    expect(players.map(({ player }) => player.id)).toEqual([1, 2, 3]);
  });

  it('ranks assist providers by assists and excludes players without an assist', () => {
    const players = [
      createTopScorer(1, 5, 1, 0, 100),
      createTopScorer(2, 1, 3, 0, 200),
      createTopScorer(3, 0, 0, 0, 50),
    ];

    expect(getAssistProviders(players).map(({ player }) => player.id)).toEqual([
      2, 1,
    ]);
  });
});

function createTopScorer(
  id: number,
  goals: number,
  assists: number,
  penaltyGoals: number,
  minutes: number
): TopScorer {
  return {
    player: {
      id,
      name: `Player ${id}`,
      firstname: 'Test',
      lastname: `Player ${id}`,
      age: 24,
      birth: { date: '2000-01-01', place: '', country: '' },
      nationality: '',
      height: '',
      weight: '',
      injured: false,
      photo: '',
    },
    statistics: [
      {
        team: { id: 1, name: 'Test FC', logo: '' },
        league: {
          id: 78,
          name: 'Bundesliga',
          country: 'Germany',
          logo: '',
          flag: null,
          season: 2026,
        },
        games: {
          appearences: 1,
          lineups: 1,
          minutes,
          number: null,
          position: 'Attacker',
          rating: null,
          captain: false,
        },
        substitutes: { in: 0, out: 0, bench: 0 },
        shots: { total: null, on: null },
        goals: { total: goals, conceded: null, assists, saves: null },
        passes: { total: null, key: null, accuracy: null },
        tackles: { total: null, blocks: null, interceptions: null },
        duels: { total: null, won: null },
        dribbles: { attempts: null, success: null, past: null },
        fouls: { drawn: null, committed: null },
        cards: { yellow: null, yellowred: null, red: null },
        penalty: {
          won: null,
          commited: null,
          scored: penaltyGoals,
          missed: null,
          saved: null,
        },
      },
    ],
  };
}
