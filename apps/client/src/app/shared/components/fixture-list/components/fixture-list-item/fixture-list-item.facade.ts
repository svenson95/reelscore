import { Injectable } from '@angular/core';

import {
  type ExtendedFixtureDTO,
  STATUS_TYPES_FINISHED,
  STATUS_TYPES_PLAYING,
  STATUS_TYPES_SCHEDULED,
  STATUS_VALUE_HALFTIME,
} from '@lib/models';
import { COMPETITION_KO_ROUNDS, isTwoLeggedRound } from '@lib/shared';

@Injectable()
export class FixtureListItemFacade {
  readonly scheduled = [...STATUS_TYPES_SCHEDULED];
  readonly halfTime = [STATUS_VALUE_HALFTIME];
  readonly playing = [...STATUS_TYPES_PLAYING];
  readonly finished = [...STATUS_TYPES_FINISHED];

  isTeamEliminated(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): boolean {
    const isFinished = this.finished.some(
      (status) => status === fixture.fixture.status.short
    );
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
