import type { FixtureDTO } from './fixtures';
import type { TeamDTO } from './team.model';

export type SearchType = 'fixtures' | 'competitions' | 'teams';

type SearchResultBase<TType extends SearchType, TData> = {
  id: string | number;
  type: TType;
  data: TData;
};

type SearchLeague = {
  id?: number;
  name?: string;
  type?: string;
  logo?: string;
  country?: string;
  flag?: string;
  season?: number;
  round?: string;
};

type SearchTeam = {
  id?: number;
  name?: string;
  logo?: string;
  winner?: boolean | null;
};

type SearchFixture = {
  id?: number;
  referee?: string | null;
  timezone?: string;
  date?: string;
  timestamp?: number;
  periods?: {
    first?: number | null;
    second?: number | null;
  };
  venue?: {
    id?: number | null;
    name?: string | null;
    city?: string | null;
  };
  status?: {
    long?: string;
    short?: string;
    elapsed?: number | null;
    extra?: number | null;
  };
};

type SearchTeams = {
  home: SearchTeam;
  away: SearchTeam;
};

export type FixtureSearchResult = SearchResultBase<
  'fixtures',
  {
    fixture: FixtureDTO['fixture'];
    league: FixtureDTO['league'];
    teams: FixtureDTO['teams'];
  }
>;

export type CompetitionSearchResult = SearchResultBase<
  'competitions',
  {
    league: FixtureDTO['league'];
  }
>;

export type TeamSearchResult = SearchResultBase<
  'teams',
  {
    team: TeamDTO['team'];
  }
>;

export type SearchResult =
  | FixtureSearchResult
  | CompetitionSearchResult
  | TeamSearchResult;

export type SearchResultGroup = {
  type: SearchType;
  label: string;
  results: SearchResult[];
};
