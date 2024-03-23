import { LEAGUES_LABELS, STANDING_LEAGUES_IDS } from '../constants';
import { LeagueSelectData } from '../models';

export const LEAGUES_METADATA: LeagueSelectData[] = [
  {
    image: 'https://media-3.api-sports.io/flags/de.svg',
    label: LEAGUES_LABELS.GERMANY_BUNDESLIGA,
    id: STANDING_LEAGUES_IDS.GERMANY_BUNDESLIGA,
  },
  {
    image: 'https://media-3.api-sports.io/flags/de.svg',
    label: LEAGUES_LABELS.GERMANY_BUNDESLIGA_2,
    id: STANDING_LEAGUES_IDS.GERMANY_BUNDESLIGA_2,
  },
  {
    image: 'https://media-3.api-sports.io/flags/gb.svg',
    label: LEAGUES_LABELS.ENGLAND_PREMIER_LEAGUE,
    id: STANDING_LEAGUES_IDS.ENGLAND_PREMIER_LEAGUE,
  },
  {
    image: 'https://media-3.api-sports.io/flags/es.svg',
    label: LEAGUES_LABELS.SPAIN_LA_LIGA,
    id: STANDING_LEAGUES_IDS.SPAIN_LA_LIGA,
  },
  {
    image: 'https://media-3.api-sports.io/flags/it.svg',
    label: LEAGUES_LABELS.ITALY_SERIE_A,
    id: STANDING_LEAGUES_IDS.ITALY_SERIE_A,
  },
  {
    image: 'https://media-3.api-sports.io/flags/fr.svg',
    label: LEAGUES_LABELS.FRANCE_LIGUE_1,
    id: STANDING_LEAGUES_IDS.FRANCE_LIGUE_1,
  },
];
