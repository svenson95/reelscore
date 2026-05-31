import type { CompetitionId } from '@lib/models';

export const isCompetitionWithMultipleGroups = (
  competitionId: CompetitionId
): boolean => {
  const COMPETITIONS_WITH_MULTIPLE_GROUPS = [1, 4, 5, 31, 32];
  return COMPETITIONS_WITH_MULTIPLE_GROUPS.includes(competitionId);
};
