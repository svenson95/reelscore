import { Pipe, PipeTransform } from '@angular/core';

import type { CompetitionRound, CompetitionRoundTranslated } from '@lib/models';

import {
  getCompetitionRoundLabel,
  type LabelType,
  type RoundLabelContext,
} from './round-label.helper';

@Pipe({
  name: 'roundLabel',
  standalone: true,
})
export class RoundLabelPipe implements PipeTransform {
  transform(
    round: CompetitionRound,
    type: LabelType = 'default',
    context: RoundLabelContext
  ): CompetitionRoundTranslated {
    return getCompetitionRoundLabel(round, type, context);
  }
}
