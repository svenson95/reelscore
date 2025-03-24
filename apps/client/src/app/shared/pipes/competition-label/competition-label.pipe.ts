import { Pipe, PipeTransform } from '@angular/core';

import { CompetitionLabel } from '@lib/models';

@Pipe({
  name: 'competitionLabel',
  standalone: true,
})
export class CompetitionLabelPipe implements PipeTransform {
  transform(value: CompetitionLabel): CompetitionLabel {
    return translateCompetitionLabel(value);
  }
}

const translateCompetitionLabel = (
  value: CompetitionLabel
): CompetitionLabel => {
  switch (value) {
    case 'League Cup':
      return 'Carabao Cup';
    case 'Euro Championship':
      return 'UEFA Europameisterschaft';
    case 'World Cup':
      return 'UEFA Weltmeisterschaft';
    case 'World Cup - Qualification Europe':
      return 'Weltmeisterschaft - Qual. Europa';
    case 'World Cup - Qualification CONCACAF':
      return 'Weltmeisterschaft - Qual. CONCACAF';
    default:
      return value;
  }
};
