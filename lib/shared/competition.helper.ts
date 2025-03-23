import {
  CompetitionId,
  CompetitionRoundString,
} from '../models/competition.model';

export const isCompetitionWithMultipleGroups = (
  competitionId: CompetitionId
) => {
  const COMPETITIONS_WITH_MULTIPLE_GROUPS = [1, 4, 5, 31, 32];
  return COMPETITIONS_WITH_MULTIPLE_GROUPS.includes(competitionId);
};

export const isCompetitionWithoutStandings = (competitionId: CompetitionId) =>
  [48, 81, 137, 528, 529, 531].includes(competitionId);

export const isCompetitionWithOneFixture = (competitionId: CompetitionId) =>
  [528, 529, 531].includes(competitionId);

export const isKoPhase = (round: CompetitionRoundString) =>
  ['Round of 16', 'Quarter-finals', 'Final', 'Semi-finals'].includes(round);
