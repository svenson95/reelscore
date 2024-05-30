import {
  Fixture,
  FixtureTeams,
  Goals,
  League,
  MatchDTO,
  Score,
} from '@lib/models';

export class FixtureDetails {
  constructor(
    public fixture: Fixture,
    public league: League,
    public teams: FixtureTeams,
    public goals: Goals,
    public score: Score
  ) {}

  static getRound(fixture: MatchDTO): number {
    const round = fixture.league.round;
    const roundAsString = round.substring(round.length - 2, round.length);
    return Number(roundAsString);
  }
}
