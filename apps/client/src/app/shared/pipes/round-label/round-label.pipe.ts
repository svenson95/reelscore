import { Pipe, PipeTransform } from '@angular/core';

import { CompetitionRound, CompetitionRoundTranslated } from '@lib/models';
import {
  CompetitionRoundType,
  DEFAULT_TRANSLATIONS,
  HEADER_TRANSLATIONS,
  LabelType,
  ROUND_LABEL_TYPES,
} from './round-label.data';

@Pipe({
  name: 'roundLabel',
  standalone: true,
})
export class RoundLabelPipe implements PipeTransform {
  transform(
    round: CompetitionRound,
    type: LabelType = 'default'
  ): CompetitionRoundTranslated {
    return this.translatedCompetitionRound(round, type);
  }

  private translatedCompetitionRound = (
    round: CompetitionRound,
    labelType: LabelType
  ): CompetitionRoundTranslated => {
    const type = this.getType(round);

    const isHeader = labelType === 'header';
    const translations = isHeader
      ? HEADER_TRANSLATIONS(round)
      : DEFAULT_TRANSLATIONS(round);

    return translations[type] ?? round;
  };

  private getType = (value: CompetitionRound): CompetitionRoundType => {
    for (const type of ROUND_LABEL_TYPES) {
      if (value.includes(type)) {
        return type;
      }
    }
    return '';
  };
}
