import { Injectable } from '@angular/core';

import {
  COMPETITION_KO_ROUNDS,
  STATUS_VALUE_HALFTIME,
  STATUS_VALUES_FINISHED,
  STATUS_VALUES_PLAYING,
  STATUS_VALUES_SCHEDULED,
} from '@reelscore-sdk/constants';
import { isTwoLeggedRound } from '@reelscore-sdk/helpers';
import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

@Injectable()
export class FixtureListItemFacade {
  readonly scheduled = [...STATUS_VALUES_SCHEDULED];
  readonly halfTime = [STATUS_VALUE_HALFTIME];
  readonly playing = [...STATUS_VALUES_PLAYING];
  readonly finished = [...STATUS_VALUES_FINISHED];

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

  private isTwoLeggedEliminated = (
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
