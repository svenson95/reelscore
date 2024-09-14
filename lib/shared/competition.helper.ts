import { CompetitionId } from '../models/competition.model';

export const isCompetitionWithMultipleGroups = (competitionId: CompetitionId) =>
  [4, 5].includes(competitionId);

export const isCompetitionWithoutStandings = (competitionId: CompetitionId) =>
  [81, 137, 528, 529, 531].includes(competitionId);
