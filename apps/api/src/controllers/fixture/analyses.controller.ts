import type {
  AnalysesDTO,
  ExtendedFixtureDTO,
  FixtureDTO,
  FixtureHomeOrAwayStrong,
  FixtureId,
  FixtureIdParameter,
  FixturePlayersWithStreak,
  GoalScorers,
  PlayerName,
  TeamId,
} from '@lib/models';

import {
  FixtureEventsService,
  FixtureService,
  FixturesService,
} from '../../services';

export class FixtureAnalysesController {
  private readonly fixtureService = new FixtureService();
  private readonly fixturesService = new FixturesService();
  private readonly eventsService = new FixtureEventsService();

  async getAnalyses(fixtureId: FixtureId): Promise<AnalysesDTO> {
    const fixture = await this.fixtureService.findById(fixtureId);

    const playersWithStreak = await this.getPlayersWithStreak(fixture);
    const homeOrAwayStrong = await this.getHomeOrAwayStrong(fixture);

    return { playersWithStreak, homeOrAwayStrong };
  }

  private async getPlayersWithStreak(
    fixture: ExtendedFixtureDTO
  ): Promise<FixturePlayersWithStreak> {
    const home = await this.getPlayersWithStreakForTeam(fixture, 'home');
    const away = await this.getPlayersWithStreakForTeam(fixture, 'away');

    return { home, away };
  }

  private async getPlayersWithStreakForTeam(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): Promise<GoalScorers> {
    const games = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      team
    );
    const scorers = await this.getGameScorers(games, fixture.teams[team].id);
    const players = scorers.filter((scorers) => scorers.length > 0);

    return [
      ...new Set(
        players
          .flatMap((sc) =>
            sc.flatMap((scorer) =>
              this.getPlayerWithGoalStreak(scorers, scorer)
            )
          )
          .filter((scorer) => scorer !== null)
      ),
    ];
  }

  private async getGameScorers(
    games: ExtendedFixtureDTO[],
    team: TeamId
  ): Promise<GoalScorers[]> {
    return Promise.all(
      games.map(async (game) => {
        const { home, away } = game.teams;
        const teamId = home.id === team ? home.id : away.id;
        return await this.getGameGoals(game.fixture.id, teamId);
      })
    );
  }

  private async getGameGoals(
    fixtureId: FixtureId,
    teamId: TeamId
  ): Promise<GoalScorers> {
    const id: FixtureIdParameter = fixtureId.toString();
    const events = await this.eventsService.findById(id);
    if (!events) return [];

    return events.response
      .filter(({ type, detail }) => {
        // TODO refactor to lib (2/2)
        const goalTypes = ['Normal Goal', 'Own Goal', 'Penalty'];
        return type === 'Goal' && goalTypes.includes(detail);
      })
      .filter(({ team }) => team.id === teamId)
      .map(({ player }) => player.name);
  }

  private getPlayerWithGoalStreak(
    games: GoalScorers[],
    player: PlayerName
  ): PlayerName | null {
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
  }

  private async getHomeOrAwayStrong(
    fixture: ExtendedFixtureDTO
  ): Promise<FixtureHomeOrAwayStrong | null> {
    const home = await this.getHomeOrAwayStrongForTeam('home', fixture);
    const away = await this.getHomeOrAwayStrongForTeam('away', fixture);

    if (home === null || away === null) return null;

    return { home, away };
  }

  private async getHomeOrAwayStrongForTeam(
    type: 'home' | 'away',
    fixture: ExtendedFixtureDTO
  ): Promise<boolean | null> {
    const teamId = fixture.teams[type].id;

    const games = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      type
    );

    const relevantGames = games.filter((game) => {
      const isHomeOrAwayGame = game.teams[type].id === teamId;
      const hasResult = game.goals.home !== null && game.goals.away !== null;

      return isHomeOrAwayGame && hasResult;
    });

    if (relevantGames.length === 0) return null;

    const wins = relevantGames.filter((game) =>
      this.hasTeamWonGame(game, teamId)
    ).length;

    const winPercentage = wins / relevantGames.length;
    const IS_HOME_OR_AWAY_STRONG_FACTOR = 0.7;

    return winPercentage > IS_HOME_OR_AWAY_STRONG_FACTOR;
  }

  private hasTeamWonGame(game: FixtureDTO, teamId: TeamId): boolean | null {
    const { home, away } = game.teams;
    const { home: homeGoals, away: awayGoals } = game.goals;
    if (homeGoals === null || awayGoals === null) {
      throw new Error('fixture should have goals');
    }

    if (home.id === teamId) return homeGoals > awayGoals;
    if (away.id === teamId) return awayGoals > homeGoals;

    return null;
  }
}
