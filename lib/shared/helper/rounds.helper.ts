import type {
  CompetitionId,
  CompetitionRound,
  CompetitionRounds,
  CompetitionRoundsData,
  CompetitionSeason,
} from '../../models/competition.model';
import { TWO_LEGGED_COMPETITION_ROUNDS } from '../constants/rounds.data';
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

export const isTwoLeggedRound = (
  competitionId: CompetitionId,
  round: CompetitionRound
): boolean => {
  return TWO_LEGGED_COMPETITION_ROUNDS[competitionId]?.includes(round) ?? false;
};
