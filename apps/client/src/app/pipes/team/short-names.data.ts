export const shortTeamName = (value: string): string => {
  switch (value) {
    // Bundesliga
    case 'Borussia Mönchengladbach':
      return "M'Gladbach";
    case 'Borussia Monchengladbach':
      return "M'Gladbach";
    case 'SV Darmstadt 98':
      return 'Darmstadt';
    case 'Bayern München':
      return 'Bayern';
    case 'Bayern Munich':
      return 'Bayern';
    case 'VfL Bochum':
      return 'Bochum';
    case 'Vfl Bochum':
      return 'VfL Bochum';
    case 'Eintracht Frankfurt':
      return 'Frankfurt';
    case 'FC Koln':
      return 'Köln';
    case '1.FC Köln':
      return 'Köln';
    case '1. FC Köln':
      return 'Köln';
    case 'Bayer Leverkusen':
      return 'Leverkusen';
    case 'Hertha Berlin':
      return 'Hertha';
    case 'Union Berlin':
      return 'Union';
    case '1899 Hoffenheim':
      return 'Hoffenheim';
    case '1. FC Heidenheim':
      return 'Heidenheim';
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
    case 'FC St. Pauli':
      return 'St. Pauli';
    case 'Holstein Kiel':
      return 'Kiel';

    // 2. Bundesliga
    case 'SC Paderborn 07':
      return 'Paderborn';
    case 'SSV Ulm 1846':
      return 'Ulm';
    case 'SSV ULM 1846':
      return 'Ulm';
    case 'FC Schalke 04':
      return 'Schalke';
    case 'Eintrach Braunschweig':
      return 'Braunschweig';
    case 'Karlsruher SC':
      return 'Karlsruhe';
    case 'Hamburger SV':
      return 'Hamburg';
    case 'Preußen Münster':
      return 'Münster';
    case 'Preussen Münster':
      return 'Münster';
    case 'Preussen Munster':
      return 'Münster';
    case '1. FC Nürnberg':
      return 'Nürnberg';
    case 'FC Nurnberg':
      return 'Nürnberg';
    case '1. FC Magdeburg':
    case 'FC Magdeburg':
      return 'Magdeburg';
    case 'SV Elversberg':
      return 'Elversberg';
    case '1. FC Kaiserslautern':
      return 'Kaiserslautern';
    case 'FC Kaiserslautern':
      return 'Kaiserslautern';
    case 'Hertha BSC':
      return 'Hertha';
    case 'Fortuna Dusseldorf':
      return 'Düsseldorf';
    case 'Fortuna Düsseldorf':
      return 'Düsseldorf';
    case 'Hannover 96':
      return 'Hannover';
    case 'Jahn Regensburg':
      return 'Regensburg';
    case 'SSV Jahn Regensburg':
      return 'Regensburg';
    case 'SpVgg Greuther Fürth':
      return 'Fürth';
    case 'SpVgg Greuther Furth':
      return 'Fürth';
    case 'FC Saarbrücken':
      return 'Saarbrücken';
    case 'Eintracht Braunschweig':
      return 'Braunschweig';
    case 'SpVgg Greuter Furth':
      return 'Fürth';
    case 'SV Sandhausen':
      return 'Sandhausen';
    case 'Hansa Rostock':
      return 'Rostock';
    case 'VfR Aalen':
      return 'Aalen';
    case 'Dynamo Dresden':
      return 'Dresden';
    case 'Arminia Bielefeld':
      return 'Bielefeld';

    // 3. Liga
    case 'Kickers Offenbach':
      return 'Offenbach';
    case 'FC Ingolstadt 04':
      return 'Ingolstadt';
    case 'Borussia Hildesheim':
      return 'Hildesheim';
    case 'Würzburger Kickers':
      return 'Würzburger K.';
    case 'Rot-Weiß Essen':
      return 'RW Essen';
    case 'TuS Koblenz':
      return 'Koblenz';
    case 'Sportfreunde Lotte':
      return 'Lotte';
    case 'SV Meppen':
      return 'Meppen';
    case 'Teutonia Ottensen':
      return 'Ottensen';
    case 'Greifswalder FC':
      return 'Greifswald';

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
      return 'Brest';
    case 'LE Havre':
      return 'Le Havre';
    case 'Lens':
      return 'RC Lens';
    case 'Saint-Etienne':
      return 'St-Étienne';
    case 'Saint Etienne':
      return 'St-Étienne';
    case 'Clermont Foot':
      return 'Clermont';

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
    case 'Leganes':
      return 'Leganés';

    // Serie A
    case 'AC Milan':
      return 'Milan';
    case 'AS Roma':
      return 'AS Rom';
    case 'Fiorentina':
    case 'AC Florenz':
      return 'Florenz';
    case 'Genoa':
      return 'Genua';
    case 'Venezia':
      return 'Venedig';
    case 'Torino':
      return 'Turin';
    case 'Napoli':
      return 'Neapel';

    default:
      return value;

    // Europa
    case 'Slavia Praha':
      return 'Prag';
    case 'Dinamo Minsk':
      return 'Minsk';
    case 'Heart Of Midlothian':
      return 'Hearts';
    case 'TSC Backa Topola':
      return 'Backa Topola';
    case 'Maccabi Tel Aviv':
      return 'Maccabi';
    case 'Apoel Nicosia':
      return 'APOEL';
    case 'Rapid Vienna':
      return 'SK Rapid';
    case 'Borac Banja Luka':
      return 'Borac';
    case 'Ferencvarosi TC':
      return 'Ferencvárosi';
    case 'Plzen':
      return 'Viktoria Pilsen';
    case 'Ajax':
      return 'Ajax';
    case 'FC Carl Zeiss Jena':
      return 'CZ Jena';
    case 'FC Midtjylland':
      return 'Midtjylland';
    case 'Slovan Bratislava':
      return 'Bratislava';
    case 'FK Crvena Zvezda':
      return 'Roter Stern';
    case 'Bodo/Glimt':
      return 'Bodø/Glimt';
    case 'Red Bull Salzburg':
      return 'RB Salzburg';
    case 'BSC Young Boys':
      return 'Young Boys';
    case 'IF elfsborg':
      return 'Elfsborg';
    case 'Malmo FF':
      return 'Malmö';
    case 'Sparta Praha':
      return 'Prag';
    case 'Dynamo Kyiv':
      return 'Dynamo Kiew';
    case 'PSV Eindhoven':
      return 'Eindhoven';
    case 'Sporting CP':
      return 'Sporting';
    case 'Shakhtar Donetsk':
      return 'Shakhtar';
    case 'Club Brugge KV':
      return 'Brügge';
    case 'Benfica':
      return 'Benfica';

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
