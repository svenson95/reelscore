import { Pipe, PipeTransform } from '@angular/core';
import { longTeamName } from './long-names.data';
import { shortTeamName } from './short-names.data';

type TeamNameOption = 'short' | 'long';

@Pipe({
  name: 'teamName',
  standalone: true,
})
export class TeamNamePipe implements PipeTransform {
  transform(value: string, options: TeamNameOption = 'long'): string {
    return options === 'short' ? shortTeamName(value) : longTeamName(value);
  }
}
