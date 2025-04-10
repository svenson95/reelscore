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

  readonly koRounds = [
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

  isTeamEliminated(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): boolean {
    const isFinished = this.finished.includes(fixture.fixture.status.short);
    if (!isFinished) return false;

    const isKoEliminated = this.isKoEliminated(fixture, team);
    const isTwoLeggedEliminated = this.isTwoLeggedEliminated(fixture, team);

    return isKoEliminated || isTwoLeggedEliminated;
  }

  private isKoEliminated = (
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ) => {
    const round = fixture.league.round;
    const isTwoLeggedCompetition = this.isTwoLeggedCompetition(fixture);
    const isTwoLeggedRound = this.getTwoLeggedRounds(fixture).includes(round);
    const isTwoLeggedKoRound = isTwoLeggedCompetition && !isTwoLeggedRound;

    const isKoRound = this.koRounds.some((r) => r === round);
    return (
      (!isTwoLeggedCompetition || isTwoLeggedKoRound) &&
      isKoRound &&
      fixture.teams[team].winner === false
    );
  };

  private isTwoLeggedEliminated = (
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): boolean => {
    const round = fixture.league.round;
    const isTwoLeggedCompetition = this.isTwoLeggedCompetition(fixture);
    const isTwoLeggedRound = this.getTwoLeggedRounds(fixture).includes(round);

    const hasFinalData = 'final' in fixture;
    const winnerOfFinal = fixture?.final?.winnerOfFinal;
    const winnerTeamId = hasFinalData ? winnerOfFinal : null;
    const isFinalFinished = !!winnerTeamId;
    const relatedTeam = fixture.teams[team].id;

    return (
      isTwoLeggedCompetition &&
      isTwoLeggedRound &&
      isFinalFinished &&
      relatedTeam !== winnerTeamId
    );
  };

  private getTwoLeggedRounds = (
    fixture: ExtendedFixtureDTO
  ): CompetitionRound[] => {
    return this.twoLeggedCompetitions[fixture.league.id] || [];
  };

  private isTwoLeggedCompetition = (fixture: ExtendedFixtureDTO): boolean => {
    return fixture.league.id in this.twoLeggedCompetitions;
  };
}
