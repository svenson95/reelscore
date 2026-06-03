import {
  COMPETITION_ID,
  COMPETITION_LABEL,
  COMPETITION_URL,
} from '@lib/shared';

import type { SelectCompetitionGroup } from '../models';
import { getCompetitionLogo, getCompetitionLogoSrcSet } from '../models';

const IMAGE_SIZE = 24;

export const SELECT_COMPETITION_DATA: SelectCompetitionGroup[] = [
  {
    label: 'Europa',
    competitions: [
      {
        image: getCompetitionLogo(
          COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.EUROPA_UEFA_CHAMPIONS_LEAGUE,
        id: COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE,
        url: COMPETITION_URL.EUROPA_UEFA_CHAMPIONS_LEAGUE,
        size: 32,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.EUROPA_UEFA_EURO_LEAGUE,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.EUROPA_UEFA_EURO_LEAGUE,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.EUROPA_UEFA_EURO_LEAGUE,
        id: COMPETITION_ID.EUROPA_UEFA_EURO_LEAGUE,
        url: COMPETITION_URL.EUROPA_UEFA_EURO_LEAGUE,
        size: 40,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.GERMANY_BUNDESLIGA,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.GERMANY_BUNDESLIGA,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.GERMANY_BUNDESLIGA,
        id: COMPETITION_ID.GERMANY_BUNDESLIGA,
        url: COMPETITION_URL.GERMANY_BUNDESLIGA,
        size: 18,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.ENGLAND_PREMIER_LEAGUE,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.ENGLAND_PREMIER_LEAGUE,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.ENGLAND_PREMIER_LEAGUE,
        id: COMPETITION_ID.ENGLAND_PREMIER_LEAGUE,
        url: COMPETITION_URL.ENGLAND_PREMIER_LEAGUE,
        size: 20,
      },
      {
        image: getCompetitionLogo(COMPETITION_ID.SPAIN_LA_LIGA, IMAGE_SIZE),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.SPAIN_LA_LIGA,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.SPAIN_LA_LIGA,
        id: COMPETITION_ID.SPAIN_LA_LIGA,
        url: COMPETITION_URL.SPAIN_LA_LIGA,
        size: 20,
      },
      {
        image: getCompetitionLogo(COMPETITION_ID.ITALY_SERIE_A, IMAGE_SIZE),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.ITALY_SERIE_A,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.ITALY_SERIE_A,
        id: COMPETITION_ID.ITALY_SERIE_A,
        url: COMPETITION_URL.ITALY_SERIE_A,
        size: 20,
      },
      {
        image: getCompetitionLogo(COMPETITION_ID.FRANCE_LIGUE_1, IMAGE_SIZE),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.FRANCE_LIGUE_1,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.FRANCE_LIGUE_1,
        id: COMPETITION_ID.FRANCE_LIGUE_1,
        url: COMPETITION_URL.FRANCE_LIGUE_1,
        size: 18,
      },
      {
        image: getCompetitionLogo(COMPETITION_ID.EREDIVISIE, IMAGE_SIZE),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.EREDIVISIE,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.EREDIVISIE,
        id: COMPETITION_ID.EREDIVISIE,
        url: COMPETITION_URL.EREDIVISIE,
        size: 18,
      },
    ],
  },
  {
    label: 'Deutschland',
    competitions: [
      {
        image: getCompetitionLogo(
          COMPETITION_ID.GERMANY_BUNDESLIGA_2,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.GERMANY_BUNDESLIGA_2,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.GERMANY_BUNDESLIGA_2,
        id: COMPETITION_ID.GERMANY_BUNDESLIGA_2,
        url: COMPETITION_URL.GERMANY_BUNDESLIGA_2,
        size: 18,
      },
      {
        image: getCompetitionLogo(COMPETITION_ID.GERMANY_SUPER_CUP, IMAGE_SIZE),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.GERMANY_SUPER_CUP,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.GERMANY_SUPER_CUP,
        id: COMPETITION_ID.GERMANY_SUPER_CUP,
        url: COMPETITION_URL.GERMANY_SUPER_CUP,
        size: 2,
      },
      {
        image: getCompetitionLogo(COMPETITION_ID.GERMANY_DFB_POKAL, IMAGE_SIZE),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.GERMANY_DFB_POKAL,
          IMAGE_SIZE
        ),
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
        image: getCompetitionLogo(
          COMPETITION_ID.ENGLAND_LEAGUE_CUP,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.ENGLAND_LEAGUE_CUP,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.ENGLAND_LEAGUE_CUP,
        id: COMPETITION_ID.ENGLAND_LEAGUE_CUP,
        url: COMPETITION_URL.ENGLAND_LEAGUE_CUP,
        size: 20, // ??
      },
      // {
      //   image: getCompetitionLogo(COMPETITION_ID.ENGLAND_EFL_TROPHY),
      //   label: COMPETITION_LABEL.ENGLAND_EFL_TROPHY,
      //   id: COMPETITION_ID.ENGLAND_EFL_TROPHY,
      //   url: COMPETITION_URL.ENGLAND_EFL_TROPHY,
      //   size: 72,
      // },
      // {
      //   image: getCompetitionLogo(COMPETITION_ID.ENGLAND_FA_TROPHY),
      //   label: COMPETITION_LABEL.ENGLAND_FA_TROPHY,
      //   id: COMPETITION_ID.ENGLAND_FA_TROPHY,
      //   url: COMPETITION_URL.ENGLAND_FA_TROPHY,
      //   size: 149,
      // },
      {
        image: getCompetitionLogo(COMPETITION_ID.ENGLAND_FA_CUP, IMAGE_SIZE),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.ENGLAND_FA_CUP,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.ENGLAND_FA_CUP,
        id: COMPETITION_ID.ENGLAND_FA_CUP,
        url: COMPETITION_URL.ENGLAND_FA_CUP,
        size: 124,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.ENGLAND_COMMUNITY_SHIELD,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.ENGLAND_COMMUNITY_SHIELD,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.ENGLAND_COMMUNITY_SHIELD,
        id: COMPETITION_ID.ENGLAND_COMMUNITY_SHIELD,
        url: COMPETITION_URL.ENGLAND_COMMUNITY_SHIELD,
        size: 2,
      },
      // {
      //   image: getCompetitionLogo(COMPETITION_ID.ENGLAND_PREMIER_LEAGUE_CUP),
      //   label: COMPETITION_LABEL.ENGLAND_PREMIER_LEAGUE_CUP,
      //   id: COMPETITION_ID.ENGLAND_PREMIER_LEAGUE_CUP,
      //   url: COMPETITION_URL.ENGLAND_PREMIER_LEAGUE_CUP,
      //   size: 20, // ??,
      // },
    ],
  },
  {
    label: 'Spanien',
    competitions: [
      {
        image: getCompetitionLogo(COMPETITION_ID.SPAIN_SUPER_CUP, IMAGE_SIZE),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.SPAIN_SUPER_CUP,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.SPAIN_SUPER_CUP,
        id: COMPETITION_ID.SPAIN_SUPER_CUP,
        url: COMPETITION_URL.SPAIN_SUPER_CUP,
        size: 2,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.SPAIN_COPA_DEL_REY,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.SPAIN_COPA_DEL_REY,
          IMAGE_SIZE
        ),
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
      // {
      //   image: getCompetitionLogo(COMPETITION_ID.ITALY_SUPER_CUP),
      //   label: COMPETITION_LABEL.ITALY_SUPER_CUP,
      //   id: COMPETITION_ID.ITALY_SUPER_CUP,
      //   url: COMPETITION_URL.ITALY_SUPER_CUP,
      //   size: 20, // ??,
      // },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.ITALY_COPPA_ITALIA,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.ITALY_COPPA_ITALIA,
          IMAGE_SIZE
        ),
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
      // {
      //   image: getCompetitionLogo(COMPETITION_ID.FRANCE_COUPE_DE_LA_LIGUE),
      //   label: COMPETITION_LABEL.FRANCE_COUPE_DE_LA_LIGUE,
      //   id: COMPETITION_ID.FRANCE_COUPE_DE_LA_LIGUE,
      //   url: COMPETITION_URL.FRANCE_COUPE_DE_LA_LIGUE,
      //   size: 18,
      // },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.FRANCE_COUPE_DE_FRANCE,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.FRANCE_COUPE_DE_FRANCE,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.FRANCE_COUPE_DE_FRANCE,
        id: COMPETITION_ID.FRANCE_COUPE_DE_FRANCE,
        url: COMPETITION_URL.FRANCE_COUPE_DE_FRANCE,
        size: 64,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.FRANCE_TROPHEE_DES_CHAMPIONS,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.FRANCE_TROPHEE_DES_CHAMPIONS,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.FRANCE_TROPHEE_DES_CHAMPIONS,
        id: COMPETITION_ID.FRANCE_TROPHEE_DES_CHAMPIONS,
        url: COMPETITION_URL.FRANCE_TROPHEE_DES_CHAMPIONS,
        size: 2,
      },
    ],
  },
  {
    label: 'USA',
    competitions: [
      {
        image: getCompetitionLogo(
          COMPETITION_ID.MAJOR_LEAGUE_SOCCER,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.MAJOR_LEAGUE_SOCCER,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.MAJOR_LEAGUE_SOCCER,
        id: COMPETITION_ID.MAJOR_LEAGUE_SOCCER,
        url: COMPETITION_URL.MAJOR_LEAGUE_SOCCER,
        size: 30,
      },
    ],
  },
  {
    label: 'Andere',
    competitions: [
      {
        image: getCompetitionLogo(
          COMPETITION_ID.EUROPA_UEFA_SUPER_CUP,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.EUROPA_UEFA_SUPER_CUP,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.EUROPA_UEFA_SUPER_CUP,
        id: COMPETITION_ID.EUROPA_UEFA_SUPER_CUP,
        url: COMPETITION_URL.EUROPA_UEFA_SUPER_CUP,
        size: 2,
      },
    ],
  },
  {
    label: 'International',
    competitions: [
      {
        image: getCompetitionLogo(
          COMPETITION_ID.INTERNATIONAL_WORLD_CUP,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.INTERNATIONAL_WORLD_CUP,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.INTERNATIONAL_WORLD_CUP,
        id: COMPETITION_ID.INTERNATIONAL_WORLD_CUP,
        url: COMPETITION_URL.INTERNATIONAL_WORLD_CUP,
        size: 32,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF,
        id: COMPETITION_ID.INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF,
        url: COMPETITION_URL.INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF,
        size: 32, // TODO check real size
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE,
        id: COMPETITION_ID.INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE,
        url: COMPETITION_URL.INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE,
        size: 32, // TODO check real size
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.INTERNATIONAL_UEFA_NATIONS_LEAGUE,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.INTERNATIONAL_UEFA_NATIONS_LEAGUE,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.INTERNATIONAL_UEFA_NATIONS_LEAGUE,
        id: COMPETITION_ID.INTERNATIONAL_UEFA_NATIONS_LEAGUE,
        url: COMPETITION_URL.INTERNATIONAL_UEFA_NATIONS_LEAGUE,
        size: 18,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.INTERNATIONAL_EURO_CHAMPIONSHIP,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.INTERNATIONAL_EURO_CHAMPIONSHIP,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.INTERNATIONAL_EURO_CHAMPIONSHIP,
        id: COMPETITION_ID.INTERNATIONAL_EURO_CHAMPIONSHIP,
        url: COMPETITION_URL.INTERNATIONAL_EURO_CHAMPIONSHIP,
        size: 24,
      },
      {
        image: getCompetitionLogo(
          COMPETITION_ID.INTERNATIONAL_FRIENDLIES,
          IMAGE_SIZE
        ),
        imageSet: getCompetitionLogoSrcSet(
          COMPETITION_ID.INTERNATIONAL_FRIENDLIES,
          IMAGE_SIZE
        ),
        label: COMPETITION_LABEL.INTERNATIONAL_FRIENDLIES,
        id: COMPETITION_ID.INTERNATIONAL_FRIENDLIES,
        url: COMPETITION_URL.INTERNATIONAL_FRIENDLIES,
        size: 99, // ?
      },
    ],
  },
];
export const SELECT_COMPETITION_DATA_FLAT = SELECT_COMPETITION_DATA.flatMap(
  (g) => g.competitions
);
