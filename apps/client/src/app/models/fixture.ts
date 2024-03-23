import { MatchDTO } from './fixtureDTO';

import { StandingsRanks, Team } from './standings';

export interface Fixture {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number;
  };
  venue: {
    id: number | null;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number;
  };
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings?: StandingsRanks[][];
}

export interface FixtureTeam extends Team {
  winner: boolean;
}

export interface FixtureTeams {
  home: FixtureTeam;
  away: FixtureTeam;
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}

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
