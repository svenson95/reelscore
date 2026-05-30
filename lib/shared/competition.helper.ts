import { CompetitionId, CompetitionRound } from '../models';

export const isCompetitionWithMultipleGroups = (
  competitionId: CompetitionId
): boolean => {
  const COMPETITIONS_WITH_MULTIPLE_GROUPS = [1, 4, 5, 31, 32];
  return COMPETITIONS_WITH_MULTIPLE_GROUPS.includes(competitionId);
};

export const isCompetitionWithoutStandings = (
  competitionId: CompetitionId
): boolean => [10, 48, 81, 137, 528, 529, 531].includes(competitionId);

export const isCompetitionWithOneFixture = (
  competitionId: CompetitionId
): boolean => [528, 529, 531].includes(competitionId);

export const isKoPhase = (round: CompetitionRound): boolean =>
  ['Round of 16', 'Quarter-finals', 'Final', 'Semi-finals'].includes(round);
