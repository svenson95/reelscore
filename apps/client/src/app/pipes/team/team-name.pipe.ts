import { Pipe, PipeTransform } from '@angular/core';
import { abbreviationTeamName } from './abbreviation-names.data';
import { longTeamName } from './long-names.data';
import { shortTeamName } from './short-names.data';

type TeamNameOption = 'abbreviation' | 'short' | 'long';

@Pipe({
  name: 'teamName',
  standalone: true,
})
export class TeamNamePipe implements PipeTransform {
  transform(value: string, options: TeamNameOption = 'long'): string {
    switch (options) {
      case 'abbreviation':
        return abbreviationTeamName(value);
      case 'short':
        return shortTeamName(value);
      case 'long':
        return longTeamName(value);
    }
  }
}
