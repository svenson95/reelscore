export const shortTeamName = (value: string): string => {
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
};
