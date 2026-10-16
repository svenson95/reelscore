import type {
  AnalysesDTO,
  ExtendedFixtureDTO,
  FixtureDTO,
  FixtureHomeOrAwayStrong,
  FixtureId,
  FixtureIdParameter,
  FixturePlayersWithStreak,
  PlayerName,
  TeamId,
} from '@reelscore-sdk/models';

import { isHighlightGoal } from '@lib/shared';

import {
  FixtureEventsService,
  FixtureService,
  FixturesService,
} from '../database';

import {
  getGoalScorerKey,
  getPlayerWithGoalStreak,
  type GoalScorer,
} from './goal-scorer.helper';

type GoalScorersByGame = GoalScorer[][];

export class FixtureAnalysesController {
  private readonly fixtureService = new FixtureService();
  private readonly fixturesService = new FixturesService();
  private readonly eventsService = new FixtureEventsService();

  async getAnalyses(fixtureId: FixtureId): Promise<AnalysesDTO> {
    const fixture = await this.fixtureService.findById(fixtureId);
    if (!fixture) {
      throw new Error(`Fixture with id ${fixtureId} not found`);
    }

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
  ): Promise<PlayerName[]> {
    const games = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      team
    );
    const scorers = await this.getGameScorers(games, fixture.teams[team].id);
    const players = scorers.filter((scorers) => scorers.length > 0);

    const uniqueScorers = new Map<string, GoalScorer>();
    for (const scorer of players.flat()) {
      uniqueScorers.set(getGoalScorerKey(scorer), scorer);
    }

    return [...uniqueScorers.values()]
      .map((scorer) => getPlayerWithGoalStreak(scorers, scorer))
      .filter((scorer): scorer is GoalScorer => scorer !== null)
      .map(({ name }) => name);
  }

  private async getGameScorers(
    games: ExtendedFixtureDTO[],
    team: TeamId
  ): Promise<GoalScorersByGame> {
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
  ): Promise<GoalScorer[]> {
    const id: FixtureIdParameter = fixtureId.toString();
    const events = await this.eventsService.findById(id);
    if (!events) return [];

    return events.response
      .filter((event) => isHighlightGoal(event))
      .filter(({ team }) => team.id === teamId)
      .flatMap(({ player }) =>
        player?.name ? [{ id: player.id, name: player.name }] : []
      );
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
      type,
      40
    );

    const relevantGames = games.filter((game) => {
      const isRelevantSideGame = game.teams[type].id === teamId;
      const hasResult = game.goals.home !== null && game.goals.away !== null;

      return isRelevantSideGame && hasResult;
    });

    if (relevantGames.length === 0) return null;

    const wins = relevantGames.filter((game) =>
      this.hasTeamWonGame(game, teamId)
    ).length;

    const winPercentage = wins / relevantGames.length;
    const HOME_STRONG_FACTOR = 0.6;
    const AWAY_STRONG_FACTOR = 0.4;
    const winFactor = type === 'home' ? HOME_STRONG_FACTOR : AWAY_STRONG_FACTOR;

    return winPercentage > winFactor;
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
