import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import type { CompetitionRound, CompetitionRoundTranslated } from '@lib/models';

import {
  getCompetitionRoundLabel,
  type RoundLabelContext,
} from './round-label.helper';

@Pipe({
  name: 'roundLabel',
  standalone: true,
})
export class RoundLabelPipe implements PipeTransform {
  transform(
    round: CompetitionRound,
    context: RoundLabelContext
  ): CompetitionRoundTranslated {
    return getCompetitionRoundLabel(round, context);
  }
}
