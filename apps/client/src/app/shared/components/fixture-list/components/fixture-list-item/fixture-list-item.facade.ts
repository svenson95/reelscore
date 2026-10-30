import { Injectable } from '@angular/core';

import {
  COMPETITION_KO_ROUNDS,
  STATUS_VALUES_FINISHED,
} from '@reelscore-sdk/constants';
import { isTwoLeggedRound } from '@reelscore-sdk/helpers';
import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

@Injectable()
export class FixtureListItemFacade {
  isTeamEliminated(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): boolean {
    const isFinished = STATUS_VALUES_FINISHED.includes(
      fixture.fixture.status.short
    );
    if (!isFinished) return false;

    const isKoEliminated = this.isKoEliminated(fixture, team);
    const isTwoLeggedEliminated = this.isTwoLeggedEliminated(fixture, team);

    return isKoEliminated || isTwoLeggedEliminated;
  }

  private readonly isKoEliminated = (
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): boolean => {
    const round = fixture.league.round;

    if (!COMPETITION_KO_ROUNDS.includes(round)) {
      return false;
    }

    if (isTwoLeggedRound(fixture.league.id, fixture.league.round)) {
      return false;
    }

    return fixture.teams[team].winner === false;
  };

  private readonly isTwoLeggedEliminated = (
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): boolean => {
    if (!isTwoLeggedRound(fixture.league.id, fixture.league.round)) {
      return false;
    }

    const winnerTeamId = fixture.final?.winnerOfFinal;

    if (!winnerTeamId) {
      return false;
    }

    return fixture.teams[team].id !== winnerTeamId;
  };
}
