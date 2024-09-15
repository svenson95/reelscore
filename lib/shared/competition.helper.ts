import {
  CompetitionId,
  CompetitionRoundString,
} from '../models/competition.model';

export const isCompetitionWithMultipleGroups = (competitionId: CompetitionId) =>
  [4, 5].includes(competitionId);

export const isCompetitionWithoutStandings = (competitionId: CompetitionId) =>
  [81, 137, 528, 529, 531].includes(competitionId);

export const isCompetitionWithOneFixture = (competitionId: CompetitionId) =>
  [528, 529, 531].includes(competitionId);

export const isKoPhase = (round: CompetitionRoundString) =>
  ['Round of 16', 'Quarter-finals', 'Final', 'Semi-finals'].includes(round);
