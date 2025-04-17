import { CompetitionName, CompetitionNameTranslated } from '@lib/models';

export const COMPETITION_NAME_MAP: Record<
  CompetitionName,
  CompetitionNameTranslated
> = {
  'League Cup': 'Carabao Cup',
  'Euro Championship': 'UEFA Europameisterschaft',
  'World Cup': 'UEFA Weltmeisterschaft',
  'World Cup - Qualification Europe': 'WM - Qualifikation Europa',
  'World Cup - Qualification CONCACAF': 'WM - Qualifikation CONCACAF',
};
