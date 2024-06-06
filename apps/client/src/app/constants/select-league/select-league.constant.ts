import {
  COMPETITION_ID,
  COMPETITION_LABEL,
  COMPETITION_URL,
} from '@app/constants';
import { SelectLeagueData as SelectCompetition } from '@app/models';

export const COMPETITION_DATA: SelectCompetition[] = [
  {
    image: 'https://media-3.api-sports.io/flags/de.svg',
    label: COMPETITION_LABEL.GERMANY_BUNDESLIGA,
    id: COMPETITION_ID.GERMANY_BUNDESLIGA,
    url: COMPETITION_URL.GERMANY_BUNDESLIGA,
    size: 18,
  },
  {
    image: 'https://media-3.api-sports.io/flags/gb.svg',
    label: COMPETITION_LABEL.ENGLAND_PREMIER_LEAGUE,
    id: COMPETITION_ID.ENGLAND_PREMIER_LEAGUE,
    url: COMPETITION_URL.ENGLAND_PREMIER_LEAGUE,
    size: 20,
  },
  {
    image: 'https://media-3.api-sports.io/flags/es.svg',
    label: COMPETITION_LABEL.SPAIN_LA_LIGA,
    id: COMPETITION_ID.SPAIN_LA_LIGA,
    url: COMPETITION_URL.SPAIN_LA_LIGA,
    size: 20,
  },
  {
    image: 'https://media-3.api-sports.io/flags/it.svg',
    label: COMPETITION_LABEL.ITALY_SERIE_A,
    id: COMPETITION_ID.ITALY_SERIE_A,
    url: COMPETITION_URL.ITALY_SERIE_A,
    size: 20,
  },
  {
    image: 'https://media-3.api-sports.io/flags/fr.svg',
    label: COMPETITION_LABEL.FRANCE_LIGUE_1,
    id: COMPETITION_ID.FRANCE_LIGUE_1,
    url: COMPETITION_URL.FRANCE_LIGUE_1,
    size: 18,
  },
];
