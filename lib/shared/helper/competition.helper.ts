import {
  type CompetitionId,
  type CompetitionRound,
  type CompetitionSeason,
} from '../../models/competition.model';
import {
  COMPETITIONS_WITH_MULTIPLE_GROUPS,
  COMPETITIONS_WITH_ONLY_ONE_FIXTURE,
  COMPETITIONS_WITHOUT_STANDINGS,
  ROUNDS_KO_PHASE,
  SEASONS,
} from '../constants/season.data';

export const isCompetitionWithMultipleGroups = (
  competitionId: CompetitionId
): boolean => {
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
