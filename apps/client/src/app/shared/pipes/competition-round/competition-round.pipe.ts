import { Pipe, PipeTransform } from '@angular/core';

import { CompetitionRound } from '@lib/models';

import { translatedCompetitionRound } from './competition-round.data';
import { LabelType } from './label.model';

@Pipe({
  name: 'competitionRound',
  standalone: true,
})
export class CompetitionRoundPipe implements PipeTransform {
  transform(
    value: CompetitionRound,
    type: LabelType = 'default'
  ): CompetitionRound {
    return translatedCompetitionRound(value, type);
  }
}
