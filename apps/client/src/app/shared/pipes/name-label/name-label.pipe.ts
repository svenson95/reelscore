import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import type { CompetitionName } from '@reelscore-sdk/models';

import type { CompetitionNameTranslated } from '@lib/models';

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
