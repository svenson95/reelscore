import type { CompetitionName, CompetitionNameTranslated } from '@lib/models';

export const COMPETITION_NAME_MAP: Record<
  CompetitionName,
  CompetitionNameTranslated
> = {
  'League Cup': 'Carabao Cup',
  'Euro Championship': 'Europameisterschaft',
  'World Cup': 'Weltmeisterschaft',
  'World Cup - Qualification Europe': 'WM - Quali. Europa',
  'World Cup - Qualification CONCACAF': 'WM - Quali. CONCACAF',
  Friendlies: 'Freundschaftsspiele',
  'UEFA Champions League': 'Champions League',
  'UEFA Europa League': 'Europa League',
};
