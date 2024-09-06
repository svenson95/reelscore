export const longTeamName = (value: string): string => {
  switch (value) {
    // Bundesliga
    case 'Bayern Munich':
    case 'Bayern München':
      return 'FC Bayern München';
    case 'Vfl Bochum':
      return 'VfL Bochum';
    case 'Eintracht Frankfurt':
      return 'Eintracht Frankfurt';
    case 'Hertha Berlin':
      return 'Hertha BSC';
    case 'FC Koln':
    case '1.FC Köln':
      return '1. FC Köln';
    case 'Bayer Leverkusen':
      return 'Bayer 04 Leverkusen';
    case 'Borussia Monchengladbach':
      return 'Borussia Mönchengladbach';

    // 2. Bundesliga
    case 'SpVgg Greuter Furth':
      return 'SpVgg Greuter Fürth';
    case 'Fortuna Dusseldorf':
      return 'Fortuna Düsseldorf';
    case 'SSV ULM 1846':
      return 'SSV Ulm 1846';
    case 'Preußen Münster':
    case 'Preussen Münster':
    case 'Preussen Munster':
      return 'Preußen Münster';
    case 'FC Nurnberg':
      return 'FC Nürnberg';
    case '1.FC Heidenheim':
      return '1. FC Heidenheim';

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
      return 'Le Havre AC';
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
    case 'Saint Etienne':
      return 'AS Saint-Étienne';
    case 'Toulouse':
      return 'FC Toulouse';
    case 'Auxerre':
      return 'AJ Auxerre';
    case 'Angers':
      return 'SCO Angers';

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
    case 'Valladolid':
      return 'Real Valladolid';
    case 'Leganes':
      return 'CD Leganés';

    // Serie A
    case 'AS Roma':
      return 'AS Roma';
    case 'Atalanta':
      return 'Atalanta Bergamo';
    case 'Bologna':
      return 'Bologna FC 1909';
    case 'Cagliari':
      return 'Cagliari Calcio';
    case 'Empoli':
      return 'Empoli FC';
    case 'Fiorentina':
      return 'AC Fiorentina';
    case 'Genoa':
      return 'CFC Genua';
    case 'Juventus':
      return 'Juventus Turin';
    case 'Lazio':
      return 'Lazio Rom';
    case 'Napoli':
      return 'SSC Napoli';
    case 'Sassuolo':
      return 'US Sassuolo';
    case 'Torino':
      return 'Torino FC';
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
    case 'Como':
      return 'Como 1907';
    case 'Parma':
      return 'Parma Calcio 1913';
    case 'Venezia':
      return 'Venezia FC';
    case 'Inter':
      return 'Inter Mailand';

    // Europa
    case 'Slavia Praha':
      return 'Slavia Prag';
    case 'Dinamo Minsk':
      return 'FK Dinamo Minsk';
    case 'TSC Backa Topola':
      return 'Backa Topola';
    case 'Apoel Nicosia':
      return 'APOEL Nicosia';
    case 'Rapid Vienna':
      return 'Sportklub Rapid Wien';
    case 'Ferencvarosi TC':
      return 'Ferencváros Budapest';
    case 'Plzen':
      return 'FC Viktoria Pilsen';
    case 'Ajax':
      return 'Ajax Amsterdam';
    case 'Slovan Bratislava':
      return 'ŠK Slovan Bratislava';
    case 'FK Crvena Zvezda':
      return 'FK Roter Stern Belgrad';
    case 'Bodo/Glimt':
      return 'FK Bodø/Glimt';
    case 'IF elfsborg':
      return 'IF Elfsborg';
    case 'Ludogorez':
      return 'Ludogorez Rasgrad';
    case 'PAOK':
      return 'PAOK Thessaloniki';
    case 'FCSB':
      return 'FCSB Bukarest';
    case 'Petrocub':
      return 'FC Petrocub-Hîncesti';
    case 'Malmo FF':
      return 'Malmö FF';
    case 'Dynamo Kyiv':
      return 'FK Dynamo Kiew';
    case 'Galatasaray':
      return 'Galatasaray Istanbul';
    case 'Molde':
      return 'Molde FK';
    case 'Sporting CP':
      return 'Sporting Clube de Portugal';
    case 'Shakhtar Donetsk':
      return 'Schachtar Donezk';
    case 'Celtic':
      return 'Celtic Glasgow';
    case 'Benfica':
      return 'SL Benfica';
    case 'Feyenoord':
      return 'Feyenoord Rotterdam';
    case 'Sturm Graz':
      return 'SK Sturm Graz';

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

    default:
      return value;
  }
};
