import type { MongoDbId } from './mongodb.model';

export interface PlayerBirth {
  date: string;
  place: string;
  country: string;
}

export interface PlayerDetails {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: PlayerBirth;
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}

interface StatisticTeam {
  id: number;
  name: string;
  logo: string;
}

interface StatisticLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
}

interface StatisticGames {
  appearences: number;
  lineups: number;
  minutes: number;
  number: number | null;
  position: string;
  rating: number | null;
  captain: boolean;
}

interface StatisticSubstitutes {
  in: number;
  out: number;
  bench: number;
}

interface StatisticShots {
  total: number | null;
  on: number | null;
}

interface StatisticGoals {
  total: number | null;
  conceded: number | null;
  assists: number | null;
  saves: number | null;
}

interface StatisticPasses {
  total: number | null;
  key: number | null;
  accuracy: number | null;
}

interface StatisticTackles {
  total: number | null;
  blocks: number | null;
  interceptions: number | null;
}

interface StatisticDuels {
  total: number | null;
  won: number | null;
}

interface StatisticDribbles {
  attempts: number | null;
  success: number | null;
  past: number | null;
}

interface StatisticFouls {
  drawn: number | null;
  committed: number | null;
}

interface StatisticCards {
  yellow: number | null;
  yellowred: number | null;
  red: number | null;
}

interface StatisticPenalty {
  won: number | null;
  commited: number | null;
  scored: number | null;
  missed: number | null;
  saved: number | null;
}

interface PlayerStatistic {
  team: StatisticTeam;
  league: StatisticLeague;
  games: StatisticGames;
  substitutes: StatisticSubstitutes;
  shots: StatisticShots;
  goals: StatisticGoals;
  passes: StatisticPasses;
  tackles: StatisticTackles;
  duels: StatisticDuels;
  dribbles: StatisticDribbles;
  fouls: StatisticFouls;
  cards: StatisticCards;
  penalty: StatisticPenalty;
}

export interface TopScorer {
  player: PlayerDetails;
  statistics: PlayerStatistic[];
}

export interface TopScorersDTO {
  _id: MongoDbId;
  parameters: {
    league: string;
    season: string;
  };
  response: TopScorer[];
  createdAt: Date;
  updatedAt: Date;
}
