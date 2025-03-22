import { Pipe, PipeTransform } from '@angular/core';

import { FixtureResult, FixtureTeam, MatchTeams } from '@lib/models';

@Pipe({
  name: 'checkScore',
  standalone: true,
})
export class CheckScorePipe implements PipeTransform {
  transform = (
    teams: MatchTeams,
    relatedTeam: FixtureTeam,
    type: FixtureResult
  ): boolean => {
    const { home, away } = teams;
    const team = home.id === relatedTeam.id ? home : away;
    switch (type) {
      case 'WIN':
        return team.winner === true;
      case 'LOSS':
        return team.winner === false;
      default:
        return false;
    }
  };
}
