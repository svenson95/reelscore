import { SelectCompetitionGroup } from '../../models';
import { COMPETITION_ID } from '../competition/id.constant';
import { COMPETITION_LABEL } from '../competition/label.constant';
import { COMPETITION_URL } from '../competition/url.constant';

export const SELECT_COMPETITION_DATA: SelectCompetitionGroup[] = [
  {
    label: 'Europa',
    competitions: [
      {
        image: 'https://media-3.api-sports.io/flags/eu.svg',
        label: COMPETITION_LABEL.EUROPA_UEFA_CHAMPIONS_LEAGUE,
        id: COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE,
        url: COMPETITION_URL.EUROPA_UEFA_CHAMPIONS_LEAGUE,
        size: 32,
      },
      {
        image: 'https://media-3.api-sports.io/flags/eu.svg',
        label: COMPETITION_LABEL.EUROPA_UEFA_EURO_LEAGUE,
        id: COMPETITION_ID.EUROPA_UEFA_EURO_LEAGUE,
        url: COMPETITION_URL.EUROPA_UEFA_EURO_LEAGUE,
        size: 40,
      },
      {
        image: 'https://media-3.api-sports.io/flags/eu.svg',
        label: COMPETITION_LABEL.EUROPA_UEFA_SUPER_CUP,
        id: COMPETITION_ID.EUROPA_UEFA_SUPER_CUP,
        url: COMPETITION_URL.EUROPA_UEFA_SUPER_CUP,
        size: 2,
      },
    ],
  },
  {
    label: 'International',
    competitions: [],
  },
  {
    label: 'Deutschland',
    competitions: [
      {
        image: 'https://media-3.api-sports.io/flags/de.svg',
        label: COMPETITION_LABEL.GERMANY_BUNDESLIGA,
        id: COMPETITION_ID.GERMANY_BUNDESLIGA,
        url: COMPETITION_URL.GERMANY_BUNDESLIGA,
        size: 18,
      },
      {
        image: 'https://media-3.api-sports.io/flags/de.svg',
        label: COMPETITION_LABEL.GERMANY_BUNDESLIGA_2,
        id: COMPETITION_ID.GERMANY_BUNDESLIGA_2,
        url: COMPETITION_URL.GERMANY_BUNDESLIGA_2,
        size: 18,
      },
      {
        image: 'https://media-3.api-sports.io/flags/de.svg',
        label: COMPETITION_LABEL.GERMANY_SUPER_CUP,
        id: COMPETITION_ID.GERMANY_SUPER_CUP,
        url: COMPETITION_URL.GERMANY_SUPER_CUP,
        size: 2,
      },
      {
        image: 'https://media-3.api-sports.io/flags/de.svg',
        label: COMPETITION_LABEL.GERMANY_DFB_POKAL,
        id: COMPETITION_ID.GERMANY_DFB_POKAL,
        url: COMPETITION_URL.GERMANY_DFB_POKAL,
        size: 64,
      },
    ],
  },
  {
    label: 'England',
    competitions: [
      {
        image: 'https://media-3.api-sports.io/flags/gb.svg',
        label: COMPETITION_LABEL.ENGLAND_PREMIER_LEAGUE,
        id: COMPETITION_ID.ENGLAND_PREMIER_LEAGUE,
        url: COMPETITION_URL.ENGLAND_PREMIER_LEAGUE,
        size: 20,
      },
      {
        image: 'https://media-3.api-sports.io/flags/gb.svg',
        label: COMPETITION_LABEL.ENGLAND_LEAGUE_CUP,
        id: COMPETITION_ID.ENGLAND_LEAGUE_CUP,
        url: COMPETITION_URL.ENGLAND_LEAGUE_CUP,
        size: 20, // ??
      },
      {
        image: 'https://media-3.api-sports.io/flags/gb.svg',
        label: COMPETITION_LABEL.ENGLAND_EFL_TROPHY,
        id: COMPETITION_ID.ENGLAND_EFL_TROPHY,
        url: COMPETITION_URL.ENGLAND_EFL_TROPHY,
        size: 72,
      },
      {
        image: 'https://media-3.api-sports.io/flags/gb.svg',
        label: COMPETITION_LABEL.ENGLAND_FA_TROPHY,
        id: COMPETITION_ID.ENGLAND_FA_TROPHY,
        url: COMPETITION_URL.ENGLAND_FA_TROPHY,
        size: 149,
      },
      {
        image: 'https://media-3.api-sports.io/flags/gb.svg',
        label: COMPETITION_LABEL.ENGLAND_FA_CUP,
        id: COMPETITION_ID.ENGLAND_FA_CUP,
        url: COMPETITION_URL.ENGLAND_FA_CUP,
        size: 124,
      },
      {
        image: 'https://media-3.api-sports.io/flags/gb.svg',
        label: COMPETITION_LABEL.ENGLAND_COMMUNITY_SHIELD,
        id: COMPETITION_ID.ENGLAND_COMMUNITY_SHIELD,
        url: COMPETITION_URL.ENGLAND_COMMUNITY_SHIELD,
        size: 2,
      },
      {
        image: 'https://media-3.api-sports.io/flags/gb.svg',
        label: COMPETITION_LABEL.ENGLAND_PREMIER_LEAGUE_CUP,
        id: COMPETITION_ID.ENGLAND_PREMIER_LEAGUE_CUP,
        url: COMPETITION_URL.ENGLAND_PREMIER_LEAGUE_CUP,
        size: 20, // ??,
      },
    ],
  },
  {
    label: 'Spanien',
    competitions: [
      {
        image: 'https://media-3.api-sports.io/flags/es.svg',
        label: COMPETITION_LABEL.SPAIN_LA_LIGA,
        id: COMPETITION_ID.SPAIN_LA_LIGA,
        url: COMPETITION_URL.SPAIN_LA_LIGA,
        size: 20,
      },
      {
        image: 'https://media-3.api-sports.io/flags/es.svg',
        label: COMPETITION_LABEL.SPAIN_SUPER_CUP,
        id: COMPETITION_ID.SPAIN_SUPER_CUP,
        url: COMPETITION_URL.SPAIN_SUPER_CUP,
        size: 2,
      },
      {
        image: 'https://media-3.api-sports.io/flags/es.svg',
        label: COMPETITION_LABEL.SPAIN_COPA_DEL_REY,
        id: COMPETITION_ID.SPAIN_COPA_DEL_REY,
        url: COMPETITION_URL.SPAIN_COPA_DEL_REY,
        size: 126,
      },
    ],
  },
  {
    label: 'Italien',
    competitions: [
      {
        image: 'https://media-3.api-sports.io/flags/it.svg',
        label: COMPETITION_LABEL.ITALY_SERIE_A,
        id: COMPETITION_ID.ITALY_SERIE_A,
        url: COMPETITION_URL.ITALY_SERIE_A,
        size: 20,
      },
      {
        image: 'https://media-3.api-sports.io/flags/it.svg',
        label: COMPETITION_LABEL.ITALY_SUPER_CUP,
        id: COMPETITION_ID.ITALY_SUPER_CUP,
        url: COMPETITION_URL.ITALY_SUPER_CUP,
        size: 20, // ??,
      },
      {
        image: 'https://media-3.api-sports.io/flags/it.svg',
        label: COMPETITION_LABEL.ITALY_COPPA_ITALIA,
        id: COMPETITION_ID.ITALY_COPPA_ITALIA,
        url: COMPETITION_URL.ITALY_COPPA_ITALIA,
        size: 44,
      },
    ],
  },
  {
    label: 'Frankreich',
    competitions: [
      {
        image: 'https://media-3.api-sports.io/flags/fr.svg',
        label: COMPETITION_LABEL.FRANCE_LIGUE_1,
        id: COMPETITION_ID.FRANCE_LIGUE_1,
        url: COMPETITION_URL.FRANCE_LIGUE_1,
        size: 18,
      },
      // {
      //   image: 'https://media-3.api-sports.io/flags/fr.svg',
      //   label: COMPETITION_LABEL.FRANCE_COUPE_DE_LA_LIGUE,
      //   id: COMPETITION_ID.FRANCE_COUPE_DE_LA_LIGUE,
      //   url: COMPETITION_URL.FRANCE_COUPE_DE_LA_LIGUE,
      //   size: 18,
      // },
      {
        image: 'https://media-3.api-sports.io/flags/fr.svg',
        label: COMPETITION_LABEL.FRANCE_COUPE_DE_FRANCE,
        id: COMPETITION_ID.FRANCE_COUPE_DE_FRANCE,
        url: COMPETITION_URL.FRANCE_COUPE_DE_FRANCE,
        size: 64,
      },
      {
        image: 'https://media-3.api-sports.io/flags/fr.svg',
        label: COMPETITION_LABEL.FRANCE_TROPHEE_DES_CHAMPIONS,
        id: COMPETITION_ID.FRANCE_TROPHEE_DES_CHAMPIONS,
        url: COMPETITION_URL.FRANCE_TROPHEE_DES_CHAMPIONS,
        size: 2,
      },
    ],
  },
];
export const SELECT_COMPETITION_DATA_FLAT = SELECT_COMPETITION_DATA.flatMap(
  (g) => g.competitions
);
