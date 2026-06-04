import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import type { FixtureTeam } from '@lib/models';

@Pipe({
  name: 'isRelated',
  standalone: true,
})
export class TeamIsRelatedPipe implements PipeTransform {
  transform = (team: FixtureTeam, relatedTeam: FixtureTeam): boolean => {
    return team.id === relatedTeam.id;
  };
}
