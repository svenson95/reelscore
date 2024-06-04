import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortTeamName',
  standalone: true,
})
export class ShortTeamNamePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      // Bundesliga
      case 'Borussia Monchengladbach':
        return "Borussia M'Gladbach";
      case 'Bayern Munich':
        return 'Bayern München';
      case 'VfL BOCHUM':
        return 'VfL Bochum';
      case 'Eintracht Frankfurt':
        return 'E. Frankfurt';
      case 'FC Koln':
        return '1. FC Köln';
      case 'Hertha Berlin':
        return 'Hertha BSC';

      // 2. Bundesliga
      case 'SC Paderborn 07':
        return 'SC Paderborn';
      case 'Eintracht Braunschweig':
        return 'E. Braunschweig';
      case 'SpVgg Greuther Furth':
        return 'Greuther Fürth';
      case 'Fortuna Dusseldorf':
        return 'F. Düsseldorf';
      case 'SV Darmstadt 98':
        return 'SV Darmstadt';

      // Premiere League
      case 'Nottingham Forest':
        return 'Nottingham Forest';
      case 'Manchester United':
        return 'Man United';
      case 'Manchester City':
        return 'Man City';

      // Ligue 1
      case 'Paris Saint Germain':
        return 'Paris SG';
      case 'Stade Brestois 29':
        return 'Stade Brest';
      case 'LE Havre':
        return 'Le Havre';

      // La Liga
      case 'Athletic Club':
        return 'Athletic Bilbao';

      default:
        return value;
    }
  }
}
