import {
  FixtureDTO,
  FixtureHomeOrAwayStrong,
  FixtureId,
  FixturePlayersWithStreak,
  GoalScorers,
  MetricsDTO,
  PlayerName,
  TeamId,
} from '@lib/models';
import { APP_DATA, findDocument } from '../../middleware';
import { FixtureEvents, Fixtures, Standings } from '../../models';
import { findLatestFixtures } from '../fixtures.controller';

export const getFixtureMetrics = async (fixtureId): Promise<MetricsDTO> => {
  const fixture = await Fixtures.findOne({
    'fixture.id': fixtureId,
  }).lean();

  const playersWithStreakData = await getPlayersWithStreak(fixture);
  const playersWithStreak = {
    home: playersWithStreakData.home,
    away: playersWithStreakData.away,
  };

  const homeOrAwayStrongData = await getHomeOrAwayStrong(fixture);
  const homeOrAwayStrong = {
    home: homeOrAwayStrongData.home,
    away: homeOrAwayStrongData.away,
  };

  return { playersWithStreak, homeOrAwayStrong };
};

const getPlayersWithStreak = async (
  fixture: FixtureDTO
): Promise<FixturePlayersWithStreak> => {
  const home = await getPlayersWithStreakForTeam(fixture, 'home');
  const away = await getPlayersWithStreakForTeam(fixture, 'away');

  return { home, away };
};

const getPlayersWithStreakForTeam = async (
  fixture: FixtureDTO,
  team: 'home' | 'away'
): Promise<GoalScorers> => {
  const GAMES_SCORED_SEQUENTIALLY = 3;
  const games = await findLatestFixtures(fixture, team);
  const scorers = await getGameScorers(games, fixture.teams[team].id);
  const players = scorers.filter((scorers) => scorers.length > 0);

  return [
    ...new Set(
      players
        .flatMap((sc) =>
          sc.flatMap((s) =>
            checkIfPlayerScored(GAMES_SCORED_SEQUENTIALLY, scorers, s)
          )
        )
        .filter((scorer) => scorer !== null)
    ),
  ];
};

const getGameScorers = async (
  games: FixtureDTO[],
  team: TeamId
): Promise<GoalScorers[]> => {
  return Promise.all(
    games.map(async (game) => {
      const { home, away } = game.teams;
      const teamId = home.id === team ? home.id : away.id;
      return await getGameGoals(game.fixture.id, teamId);
    })
  );
};

const getGameGoals = async (
  fixtureId: FixtureId,
  teamId: TeamId
): Promise<GoalScorers> => {
  const events = await findDocument(
    FixtureEvents,
    'parameters.fixture',
    fixtureId
  );
  return events.response
    .filter(
      (event) => event.type === 'Goal' && event.detail !== 'Missed Penalty'
    )
    .filter((event) => event.team.id === teamId)
    .map((event) => event.player.name);
};

const checkIfPlayerScored = (
  amount: number,
  games: GoalScorers[],
  player: PlayerName
): PlayerName | null => {
  const score = games.slice(0, amount).reduce((acc, game, idx) => {
    const playerScore = game.filter((scorer) => scorer === player);
    if (playerScore.length === 0 || (idx > 0 && acc === 0)) return 0;
    return acc + playerScore.length;
  }, 0);
  return score > 0 ? player : null;
};

const getHomeOrAwayStrong = async (
  fixture: FixtureDTO
): Promise<FixtureHomeOrAwayStrong> => {
  const home = await getHomeOrAwayStrongForTeam('home', fixture);
  const away = await getHomeOrAwayStrongForTeam('away', fixture);

  return { home, away };
};

const getHomeOrAwayStrongForTeam = async (
  type: 'home' | 'away',
  fixture: FixtureDTO
): Promise<boolean> => {
  const TEAM_IS_HOME_OR_AWAY_STRONG_RANK = 5;
  const competitionId = fixture.league.id;
  const query = {
    'league.id': competitionId,
    'league.season': APP_DATA.season,
  };
  const data = await Standings.findOne(query).sort({ _id: -1 }).lean();
  const teamId = fixture.teams[type].id;
  const standings = data.league.standings[type === 'home' ? 1 : 2];
  const team = standings.find((r) => r.team.id === teamId);
  return team.rank <= TEAM_IS_HOME_OR_AWAY_STRONG_RANK;
};
