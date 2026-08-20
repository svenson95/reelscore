import type { CompetitionId } from '@lib/models';

export const COMPETITION_WITH_REVERSED_SINGLE_ROUND = 10 as CompetitionId;

export const isReversedSingleRoundCompetition = (
  competitionId: CompetitionId | string | null | undefined
): boolean => Number(competitionId) === COMPETITION_WITH_REVERSED_SINGLE_ROUND;
