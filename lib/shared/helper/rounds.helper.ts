import {
  type CompetitionId,
  type CompetitionRounds,
  type CompetitionRoundsData,
  type CompetitionSeason,
} from '../../models/competition.model';

import { SEASONS } from '../constants/season.data';

export const buildCompetitionRounds = (
  roundsByCompetition: Record<
    CompetitionId,
    Partial<Record<CompetitionSeason, CompetitionRounds>>
  >
): Record<CompetitionSeason, CompetitionRoundsData> => {
  const result = Object.fromEntries(
    SEASONS.map((season) => [season, {}])
  ) as Record<CompetitionSeason, CompetitionRoundsData>;

  for (const [competitionId, roundsBySeason] of Object.entries(
    roundsByCompetition
  )) {
    let latestRounds: CompetitionRounds | undefined;

    for (const season of SEASONS) {
      latestRounds = roundsBySeason[season] ?? latestRounds;

      if (latestRounds) {
        result[season][Number(competitionId) as CompetitionId] = latestRounds;
      }
    }
  }

  return result;
};
