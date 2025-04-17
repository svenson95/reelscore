import { Pipe, PipeTransform } from '@angular/core';

import { CompetitionName, CompetitionNameTranslated } from '@lib/models';

import { COMPETITION_NAME_MAP } from './name-label.data';

@Pipe({
  name: 'nameLabel',
  standalone: true,
})
export class NameLabelPipe implements PipeTransform {
  transform(value: CompetitionName): CompetitionNameTranslated {
    return COMPETITION_NAME_MAP[value] || value;
  }
}
