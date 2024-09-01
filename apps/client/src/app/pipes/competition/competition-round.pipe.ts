import { Pipe, PipeTransform } from '@angular/core';

import { CompetitionRound } from '@lib/models';
import { CompetitionRoundLabel, LabelType } from './label.model';
import { translatedCompetitionRound } from './translate-competition-round.data';

@Pipe({
  name: 'competitionRound',
  standalone: true,
})
export class CompetitionRoundPipe implements PipeTransform {
  transform(
    value: CompetitionRound,
    type: LabelType = 'default'
  ): CompetitionRoundLabel {
    return translatedCompetitionRound(value, type);
  }
}
