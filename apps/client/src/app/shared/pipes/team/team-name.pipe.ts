import { Pipe, PipeTransform } from '@angular/core';

import { ABBREVIATION_TEAM_NAMES } from './abbreviation-names.data';
import { LONG_TEAM_NAMES } from './long-names.data';
import { SHORT_TEAM_NAMES } from './short-names.data';

type TeamNameOption = 'abbreviation' | 'short' | 'long';

const TEAM_NAME_MAPS: Readonly<Record<TeamNameOption, Record<string, string>>> =
  {
    abbreviation: ABBREVIATION_TEAM_NAMES,
    short: SHORT_TEAM_NAMES,
    long: LONG_TEAM_NAMES,
  };

@Pipe({
  name: 'teamName',
  standalone: true,
  pure: true,
})
export class TeamNamePipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    options: TeamNameOption = 'long'
  ): string {
    if (!value) return '';
    return TEAM_NAME_MAPS[options][value] ?? value;
  }
}
