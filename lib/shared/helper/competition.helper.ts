import {
  type CompetitionId,
  type CompetitionRound,
  type CompetitionSeason,
} from '../../models/competition.model';
import {
  COMPETITION_WITH_MULTIPLE_ROUNDS_IN_SOME_SEASONS,
  COMPETITIONS_WITH_MULTIPLE_GROUPS,
  COMPETITIONS_WITH_ONLY_ONE_FIXTURE,
  COMPETITIONS_WITHOUT_STANDINGS,
  ROUNDS_KO_PHASE,
  SEASONS,
} from '../constants/season.data';

const MULTIPLE_GROUPS_BY_COMPETITION_AND_SEASON: Partial<
  Record<CompetitionId, (season: CompetitionSeason) => boolean>
> = {
  [COMPETITION_WITH_MULTIPLE_ROUNDS_IN_SOME_SEASONS[0]]: (season) =>
    season < 2024,
  [COMPETITION_WITH_MULTIPLE_ROUNDS_IN_SOME_SEASONS[1]]: (season) =>
    season < 2024,
};

export const isCompetitionWithMultipleGroups = (
  competitionId: CompetitionId,
  season: CompetitionSeason
): boolean => {
  const hasSeasonSpecificRule =
    MULTIPLE_GROUPS_BY_COMPETITION_AND_SEASON[competitionId];

  if (hasSeasonSpecificRule) {
    return hasSeasonSpecificRule(season);
  }

  return COMPETITIONS_WITH_MULTIPLE_GROUPS.includes(competitionId);
};

export const isCompetitionWithoutStandings = (
  competitionId: CompetitionId
): boolean => COMPETITIONS_WITHOUT_STANDINGS.includes(competitionId);

export const isCompetitionWithOneFixture = (
  competitionId: CompetitionId
): boolean => COMPETITIONS_WITH_ONLY_ONE_FIXTURE.includes(competitionId);

export const isKoPhase = (round: CompetitionRound): boolean =>
  ROUNDS_KO_PHASE.includes(round);

export const isCompetitionSeason = (
  season: number
): season is CompetitionSeason => {
  return SEASONS.includes(season);
};
