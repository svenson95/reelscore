import {
  AnalysesDTO,
  FixtureDTO,
  FixtureHomeOrAwayStrong,
  FixtureId,
  FixturePlayersWithStreak,
  GoalScorers,
  PlayerName,
  TeamId,
} from '@lib/models';
import { APP_DATA, findDocument } from '../../middleware';
import { FixtureEvents, Fixtures, Standings } from '../../models';
import { findLatestFixtures } from '../fixtures.controller';

export const getFixtureAnalyses = async (fixtureId): Promise<AnalysesDTO> => {
  const fixture = await Fixtures.findOne({
    'fixture.id': fixtureId,
  }).lean();

  const playersWithStreak = await getPlayersWithStreak(fixture);
  const homeOrAwayStrong = await getHomeOrAwayStrong(fixture);

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
  const games = await findLatestFixtures(fixture, team);
  const scorers = await getGameScorers(games, fixture.teams[team].id);
  const players = scorers.filter((scorers) => scorers.length > 0);

  return [
    ...new Set(
      players
        .flatMap((sc) => sc.flatMap((s) => checkIfPlayerScored(scorers, s)))
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
  if (!events) return [];
  return events.response
    .filter(
      (event) => event.type === 'Goal' && event.detail !== 'Missed Penalty'
    )
    .filter((event) => event.team.id === teamId)
    .map((event) => event.player.name);
};

const checkIfPlayerScored = (
  games: GoalScorers[],
  player: PlayerName
): PlayerName | null => {
  const LAST_FIXTURES_AMOUNT = 5;
  const STREAK_FAIL_AT_AMOUNT = 2;
  let streakFail = 0;
  const score = games.slice(0, LAST_FIXTURES_AMOUNT).reduce((acc, game) => {
    const playerScore = game.filter((scorer) => scorer === player);
    const playerScored = playerScore.length > 0;
    if (!playerScored) streakFail++;
    if (streakFail === STREAK_FAIL_AT_AMOUNT) return 0;
    return acc + (playerScored ? 1 : 0);
  }, 0);
  return score >= 3 ? player : null;
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
): Promise<boolean | null> => {
  const TEAM_IS_HOME_OR_AWAY_STRONG_RANK = 5;
  const competitionId = fixture.league.id;
  const query = {
    'league.id': competitionId,
    'league.season': APP_DATA.season,
  };
  const data = await Standings.findOne(query).sort({ _id: -1 }).lean();
  const teamId = fixture.teams[type].id;
  if (data.league.standings.length <= 1) return null;
  const standings = data.league.standings[type === 'home' ? 1 : 2];
  const team = standings.find((r) => r.team.id === teamId);
  return team.rank <= TEAM_IS_HOME_OR_AWAY_STRONG_RANK;
};
