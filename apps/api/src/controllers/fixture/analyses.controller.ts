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
import { APP_DATA } from '../../middleware';
import {
  FixtureEventsService,
  FixtureService,
  FixturesService,
  StandingsService,
} from '../../services';

export class FixtureAnalysesController {
  private fixtureService = new FixtureService();
  private fixturesService = new FixturesService();
  private standingsService = new StandingsService();
  private eventsService = new FixtureEventsService();

  async getAnalyses(fixtureId: FixtureId): Promise<AnalysesDTO> {
    const fixture = await this.fixtureService.findById(fixtureId);

    const playersWithStreak = await this.getPlayersWithStreak(fixture);
    const homeOrAwayStrong = await this.getHomeOrAwayStrong(fixture);

    return { playersWithStreak, homeOrAwayStrong };
  }

  private async getPlayersWithStreak(
    fixture: FixtureDTO
  ): Promise<FixturePlayersWithStreak> {
    const home = await this.getPlayersWithStreakForTeam(fixture, 'home');
    const away = await this.getPlayersWithStreakForTeam(fixture, 'away');

    return { home, away };
  }

  private async getPlayersWithStreakForTeam(
    fixture: FixtureDTO,
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
    games: FixtureDTO[],
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
    const events = await this.eventsService.findById(fixtureId);
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
    fixture: FixtureDTO
  ): Promise<FixtureHomeOrAwayStrong> {
    const home = await this.getHomeOrAwayStrongForTeam('home', fixture);
    const away = await this.getHomeOrAwayStrongForTeam('away', fixture);

    return { home, away };
  }

  private async getHomeOrAwayStrongForTeam(
    type: 'home' | 'away',
    fixture: FixtureDTO
  ): Promise<boolean | null> {
    const TEAM_IS_HOME_OR_AWAY_STRONG_RANK = 5;
    const competitionId = fixture.league.id;
    const query = {
      'league.id': competitionId,
      'league.season': APP_DATA.season,
    };
    const data = await this.standingsService.findByQuery(query);
    const teamId = fixture.teams[type].id;
    if (data.league.standings.length <= 1) return null;
    const standings = data.league.standings[type === 'home' ? 1 : 2];
    const team = standings.find((r) => r.team.id === teamId);
    return team.rank <= TEAM_IS_HOME_OR_AWAY_STRONG_RANK;
  }
}
