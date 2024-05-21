import { LEAGUES_LABELS, STANDING_LEAGUES_IDS } from '../constants';
import { SelectLeagueData } from '../models';
import { LEAGUES_URLS } from './leagues-urls';

export const LEAGUES_METADATA: SelectLeagueData[] = [
  {
    image: 'https://media-3.api-sports.io/flags/de.svg',
    label: LEAGUES_LABELS.GERMANY_BUNDESLIGA,
    id: STANDING_LEAGUES_IDS.GERMANY_BUNDESLIGA,
    url: LEAGUES_URLS.GERMANY_BUNDESLIGA,
  },
  // {
  //   image: 'https://media-3.api-sports.io/flags/de.svg',
  //   label: LEAGUES_LABELS.GERMANY_BUNDESLIGA_2,
  //   id: STANDING_LEAGUES_IDS.GERMANY_BUNDESLIGA_2,
  //   url: LEAGUES_URLS.GERMANY_BUNDESLIGA_2,
  // },
  {
    image: 'https://media-3.api-sports.io/flags/gb.svg',
    label: LEAGUES_LABELS.ENGLAND_PREMIER_LEAGUE,
    id: STANDING_LEAGUES_IDS.ENGLAND_PREMIER_LEAGUE,
    url: LEAGUES_URLS.ENGLAND_PREMIER_LEAGUE,
  },
  {
    image: 'https://media-3.api-sports.io/flags/es.svg',
    label: LEAGUES_LABELS.SPAIN_LA_LIGA,
    id: STANDING_LEAGUES_IDS.SPAIN_LA_LIGA,
    url: LEAGUES_URLS.SPAIN_LA_LIGA,
  },
  {
    image: 'https://media-3.api-sports.io/flags/it.svg',
    label: LEAGUES_LABELS.ITALY_SERIE_A,
    id: STANDING_LEAGUES_IDS.ITALY_SERIE_A,
    url: LEAGUES_URLS.ITALY_SERIE_A,
  },
  {
    image: 'https://media-3.api-sports.io/flags/fr.svg',
    label: LEAGUES_LABELS.FRANCE_LIGUE_1,
    id: STANDING_LEAGUES_IDS.FRANCE_LIGUE_1,
    url: LEAGUES_URLS.FRANCE_LIGUE_1,
  },
];
