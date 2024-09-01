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

    // 2. Bundesliga
    case 'SC Paderborn 07':
      return 'Paderborn';
    case 'SSV Ulm 1846':
      return 'Ulm';
    case 'FC Schalke 04':
      return 'Schalke';
    case '1. FC Köln':
      return 'Köln';
    case 'Eintrach Braunschweig':
      return 'Braunschweig';
    case 'Karlsruher SC':
      return 'Karlsruhe';
    case 'Hambuger SV':
      return 'Hamburg';
    case 'Preußen Münster':
      return 'Münster';
    case '1. FC Nürnberg':
      return 'Nürnberg';
    case '1. FC Magdeburg':
      return 'Magdeburg';
    case 'SV Elversberg':
      return 'Elversberg';
    case '1. FC Kaiserslautern':
      return 'Kaiserslautern';
    case 'Hertha BSC':
      return 'Hertha';
    case 'Fortuna Düsseldorf':
      return 'Düsseldorf';
    case 'Hannover 96':
      return 'Hannover';
    case 'SSV Jahn Regensburg':
      return 'Regensburg';
    case 'SpVgg Greuther Fürth':
      return 'Fürth';

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

    // International
    case 'Northern Ireland':
      return 'Nordirland';
    case 'Azerbaijan':
      return 'Aserbaidschan';
    case 'Sweden':
      return 'Schweden';
    case 'Croatia':
      return 'Kroatien';
    case 'Denmark':
      return 'Dänemark';
    case 'Switzerland':
      return 'Schweiz';
    case 'Scotland':
      return 'Schottland';
    case 'Poland':
      return 'Polen';
    case 'Serbia':
      return 'Serbien';
    case 'Spain':
      return 'Spanien';
    case 'Bulgaria':
      return 'Bulgarien';
    case 'Estonia':
      return 'Estland';
    case 'Slovakia':
      return 'Slowakei';
    case 'Luxembourg':
      return 'Luxemburg';
    case 'Lithuania':
      return 'Litauen';
    case 'Cyprus':
      return 'Zypern';
    case 'France':
      return 'Frankreich';
    case 'Italy':
      return 'Italien';
    case 'Belgium':
      return 'Belgien';
    case 'Romania':
      return 'Rumänien';
    case 'Faroe Islands':
      return 'Färöer';
    case 'FYR Macedonia':
      return 'Nordmazedonien';
    case 'Armenia':
      return 'Armenien';
    case 'Latvia':
      return 'Lettland';
    case 'Moldova':
      return 'Moldawien';
    case 'Netherlands':
      return 'Niederlande';
    case 'Bosnia & Herzegovina':
      return 'Bosnien-Herzegowina';
    case 'Germany':
      return 'Deutschland';
    case 'Hungary':
      return 'Ungarn';
    case 'Kazakhstan':
      return 'Kasachstan';
    case 'Norway':
      return 'Norwegen';
    case 'Iceland':
      return 'Island';
    case 'Slovenia':
      return 'Slowenien';
    case 'Austria':
      return 'Österreich';
    case 'Türkiye':
      return 'Türkei';
    case 'Georgia':
      return 'Georgien';
    case 'Czech Republic':
      return 'Tschechien';
    case 'Rep. of Ireland':
      return 'Irland';
    case 'Greece':
      return 'Griechenland';
    case 'Finland':
      return 'Finnland';
    case 'Albania':
      return 'Albanien';
  }
};
