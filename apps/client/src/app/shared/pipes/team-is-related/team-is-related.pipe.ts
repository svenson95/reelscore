import { Pipe, PipeTransform } from '@angular/core';

import { FixtureTeam } from '@lib/models';

@Pipe({
  name: 'isRelated',
  standalone: true,
})
export class TeamIsRelatedPipe implements PipeTransform {
  transform = (team: FixtureTeam, relatedTeam: FixtureTeam): boolean => {
    return team.id === relatedTeam.id;
  };
}
