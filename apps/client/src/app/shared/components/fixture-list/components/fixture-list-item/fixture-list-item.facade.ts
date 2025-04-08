import { Injectable } from '@angular/core';

import { COMPETITION_ID } from '@lib/constants';
import {
  CompetitionId,
  CompetitionRound,
  ExtendedFixtureDTO,
  StatusShort,
} from '@lib/models';

@Injectable()
export class FixtureListItemFacade {
  readonly notStarted: StatusShort[] = ['TBD', 'NS'];
  readonly halfTime: StatusShort[] = ['HT'];
  readonly playing: StatusShort[] = [
    '1H',
    '2H',
    'ET',
    'P',
    'BT',
    'SUSP',
    'INT',
  ];
  readonly finished: StatusShort[] = ['FT', 'AET', 'PEN'];
  readonly twoLeggedCompetitions: { [key: CompetitionId]: CompetitionRound[] } =
    {
      [COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE]: [
        'Round of 16',
        'Quarter-finals',
        'Semi-finals',
      ],
      [COMPETITION_ID.EUROPA_UEFA_EURO_LEAGUE]: [
        'Round of 16',
        'Quarter-finals',
        'Semi-finals',
      ],
      [COMPETITION_ID.INTERNATIONAL_UEFA_NATIONS_LEAGUE]: [
        'Play-offs A/B',
        'Play-offs B/C',
        'Quarter-finals',
        'Play-offs C/D',
      ],
      [COMPETITION_ID.ENGLAND_LEAGUE_CUP]: ['Semi-finals'],
      [COMPETITION_ID.ITALY_COPPA_ITALIA]: ['Semi-finals'],
      [COMPETITION_ID.SPAIN_COPA_DEL_REY]: ['Semi-finals'],
    };

  isTeamEliminated(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): boolean {
    const isFinished = this.finished.includes(fixture.fixture.status.short);
    if (!isFinished) return false;
    const competitionTwoLeggedRounds =
      this.twoLeggedCompetitions[fixture.league.id];
    const isCompetitionWithTwoLeggedFinals =
      competitionTwoLeggedRounds !== undefined;

    const koPhaseRounds = [
      'Preliminary Round',
      'Play-offs',
      '1st Round',
      '2nd Round',
      '3rd Round',
      'Round of 16',
      'Quarter-finals',
      'Semi-finals',
      'Final',
    ];
    const isKoPhase = koPhaseRounds.some((r) => r === fixture.league.round);
    const isKoEliminated =
      !isCompetitionWithTwoLeggedFinals &&
      isKoPhase &&
      fixture.teams[team].winner === false;

    const isTwoLegged =
      isCompetitionWithTwoLeggedFinals &&
      competitionTwoLeggedRounds.includes(fixture.league.round);

    const isExtendedFixture = 'final' in fixture;
    const winnerTeamId = isExtendedFixture
      ? fixture?.final?.winnerOfFinal
      : null;
    const isFinalFinished = !!winnerTeamId;

    const isTwoLeggedEliminated =
      isTwoLegged && isFinalFinished && fixture.teams[team].id !== winnerTeamId;

    return isKoEliminated || isTwoLeggedEliminated;
  }
}
