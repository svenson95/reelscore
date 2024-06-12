import { Pipe, PipeTransform } from '@angular/core';

type TeamNameOption = 'short' | 'long';

@Pipe({
  name: 'teamName',
  standalone: true,
})
export class TeamNamePipe implements PipeTransform {
  transform(value: string, options: TeamNameOption = 'long'): string {
    return options === 'short'
      ? this.shortTeamName(value)
      : this.longTeamName(value);
  }

  private shortTeamName(value: string): string {
    switch (value) {
      // Bundesliga
      case 'Borussia Monchengladbach':
        return "M'Gladbach";
      case 'SV Darmstadt 98':
        return 'Darmstadt';
      case 'Bayern Munich':
        return 'Bayern';
      case 'VfL BOCHUM':
        return 'Bochum';
      case 'Eintracht Frankfurt':
        return 'Frankfurt';
      case 'FC Koln':
        return 'Köln';
      case 'Bayer Leverkusen':
        return 'Leverkusen';
      case 'Hertha Berlin':
        return 'Hertha';
      case '1899 Hoffenheim':
        return 'Hoffenheim';
      case 'FC Heidenheim':
        return 'Heidenheim';
      case 'Borussia Dortmund':
        return 'Dortmund';
      case 'VfL Wolfsburg':
        return 'Wolfsburg';
      case 'SC Freiburg':
        return 'Freiburg';
      case 'FSV Mainz 05':
        return 'Mainz';
      case 'FC Augsburg':
        return 'Augsburg';
      case 'VfB Stuttgart':
        return 'Stuttgart';
      case 'Werder Bremen':
        return 'Bremen';

      // Premiere League
      case 'Nottingham Forest':
        return 'Nottingham';
      case 'Manchester United':
        return 'Man United';
      case 'Manchester City':
        return 'Man City';
      case 'Tottenham':
        return 'Spurs';
      case 'Crystal Palace':
        return 'Crystal';

      // Ligue 1
      case 'Paris Saint Germain':
        return 'Paris SG';
      case 'Stade Brestois 29':
        return 'Stade Brest';
      case 'LE Havre':
        return 'Le Havre';
      case 'Lens':
        return 'RC Lens';
      case 'Saint-Etienne':
        return 'Saint-Étienne';

      // La Liga
      case 'Athletic Club':
        return 'Bilbao';
      case 'Atletico Madrid':
        return 'Atlético';
      case 'Cadiz':
        return 'Cádiz';
      case 'Almeria':
        return 'Almería';
      case 'Granada CF':
        return 'Granada';
      case 'Rayo Vallecano':
        return 'Vallecano';
      case 'Real Sociedad':
        return 'Sociedad';

      // Serie A
      case 'AC Milan':
        return 'Milan';
      case 'AS Roma':
        return 'Roma';
      case 'Fiorentina':
        return 'AC Florenz';

      default:
        return value;
    }
  }

  private longTeamName(value: string): string {
    switch (value) {
      // Bundesliga
      case 'Borussia Monchengladbach':
        return 'Borussia Mönchengladbach';
      case 'Bayern Munich':
        return 'FC Bayern München';
      case 'VfL BOCHUM':
        return 'VfL Bochum';
      case 'Eintracht Frankfurt':
        return 'Eintracht Frankfurt';
      case 'Hertha Berlin':
        return 'Hertha BSC';
      case 'FC Koln':
        return '1.FC Köln';
      case 'Bayer Leverkusen':
        return 'Bayer 04 Leverkusen';

      // Premiere League
      case 'Arsenal':
        return 'Arsenal FC';
      case 'Chelsea':
        return 'Chelsea FC';
      case 'Liverpool':
        return 'Liverpool FC';
      case 'Tottenham':
        return 'Tottenham Hotspur';
      case 'Aston Villa':
        return 'Aston Villa';
      case 'Crystal Palace':
        return 'Crystal Palace';
      case 'Everton':
        return 'Everton';
      case 'Leeds United':
        return 'Leeds United';
      case 'Southampton':
        return 'Southampton';
      case 'West Ham':
        return 'West Ham United';
      case 'Wolves':
        return 'Wolverhampton Wanderers';
      case 'Brighton':
        return 'Brighton & Hove Albion';
      case 'Burnley':
        return 'Burnley';
      case 'Fulham':
        return 'Fulham';
      case 'Sheffield Utd':
        return 'Sheffield United';
      case 'Luton':
        return 'Luton Town';

      // Ligue 1
      case 'Paris Saint Germain':
        return 'Paris Saint-Germain';
      case 'LE Havre':
        return 'Le Havre';
      case 'Marseille':
        return 'Olympique de Marseille';
      case 'Metz':
        return 'FC Metz';
      case 'Monaco':
        return 'AS Monaco';
      case 'Nantes':
        return 'FC Nantes';
      case 'Lens':
        return 'Racing Club de Lens';
      case 'Lille':
        return 'Lille Olympique Sporting Club';
      case 'Lorient':
        return 'FC Lorient';
      case 'Lyon':
        return 'Olympique Lyonnais';
      case 'Montpellier':
        return 'Montpellier HSC';
      case 'Nice':
        return 'OGC Nizza';
      case 'Rennes':
        return 'Stade Rennais FC';
      case 'Reims':
        return 'Stade de Reims';
      case 'Strasbourg':
        return 'Racing Club de Strasbourg';
      case 'Saint-Etienne':
        return 'AS Saint-Étienne';
      case 'Toulouse':
        return 'FC Toulouse';

      // La Liga
      case 'Athletic Club':
        return 'Athletic Bilbao';
      case 'Atletico Madrid':
        return 'Atlético Madrid';
      case 'Barcelona':
        return 'FC Barcelona';
      case 'Real Betis':
        return 'Real Betis Sevilla';
      case 'Real Madrid':
        return 'Real Madrid CF';
      case 'Real Sociedad':
        return 'Real Sociedad San Sebastián';
      case 'Sevilla':
        return 'FC Sevilla';
      case 'Valencia':
        return 'FC Valencia';
      case 'Villarreal':
        return 'Villarreal CF';
      case 'Mallorca':
        return 'RCD Mallorca';
      case 'Almeria':
        return 'UD Almería';
      case 'Espanyol':
        return 'RCD Espanyol Barcelona';
      case 'Getafe':
        return 'Getafe CF';
      case 'Granada':
        return 'Granada CF';
      case 'Levante':
        return 'Levante UD';
      case 'Osasuna':
        return 'CA Osasuna';
      case 'Rayo Vallecano':
        return 'Rayo Vallecano de Madrid';
      case 'Las Palmas':
        return 'UD Las Palmas';
      case 'Alaves':
        return 'Deportivo Alavés';
      case 'Girona':
        return 'Girona FC';
      case 'Cadiz':
        return 'Cádiz CF';

      // Serie A
      case 'AS Roma':
        return 'AS Roma';
      case 'Atalanta':
        return 'Atalanta Bergamo';
      case 'Bologna':
        return 'FC Bologna';
      case 'Cagliari':
        return 'Cagliari Calcio';
      case 'Empoli':
        return 'Empoli FC';
      case 'Fiorentina':
        return 'AC Florenz';
      case 'Genoa':
        return 'CFC Genoa';
      case 'Juventus':
        return 'Juventus Turin';
      case 'Lazio':
        return 'Lazio Rom';
      case 'Napoli':
        return 'SSC Napoli';
      case 'Sassuolo':
        return 'US Sassuolo';
      case 'Torino':
        return 'FC Turin';
      case 'Udinese':
        return 'Udinese Calcio';
      case 'Verona':
        return 'Hellas Verona';
      case 'Salernitana':
        return 'US Salernitana';
      case 'Frosinone':
        return 'Frosinone Calcio';
      case 'Lecce':
        return 'US Lecce';
      case 'Monza':
        return 'AC Monza';

      default:
        return value;
    }
  }
}
