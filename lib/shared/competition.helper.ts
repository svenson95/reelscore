import { CompetitionId } from '../models/competition.model';

export const isCompetitionWithMultipleGroups = (competitionId: CompetitionId) =>
  [4, 5].includes(competitionId);
