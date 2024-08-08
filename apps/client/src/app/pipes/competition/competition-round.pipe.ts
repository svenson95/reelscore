import { Pipe, PipeTransform } from '@angular/core';
import { translatedCompetitionRound } from './round-labels.data';

@Pipe({
  name: 'competitionRound',
  standalone: true,
})
export class CompetitionRoundPipe implements PipeTransform {
  transform(value: string): string {
    return translatedCompetitionRound(value);
  }
}
