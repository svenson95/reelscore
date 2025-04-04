export const shortTeamName = (value: string): string => {
  switch (value) {
    // Bundesliga
    case 'Borussia Mönchengladbach':
    case 'Borussia Monchengladbach':
      return "M'Gladbach";
    case 'SV Darmstadt 98':
      return 'Darmstadt';
    case 'Bayern München':
    case 'Bayern Munich':
      return 'Bayern';
    case 'VfL Bochum':
    case 'Vfl Bochum':
      return 'Bochum';
    case 'Eintracht Frankfurt':
      return 'Frankfurt';
    case 'FC Koln':
    case '1.FC Köln':
    case '1. FC Köln':
      return 'Köln';
    case 'Bayer Leverkusen':
      return 'Leverkusen';
    case 'Union Berlin':
      return 'Union';
    case '1899 Hoffenheim':
      return 'Hoffenheim';
    case '1. FC Heidenheim':
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
    case 'Karlsruher SC':
      return 'Karlsruhe';
    case 'Hamburger SV':
      return 'Hamburg';
    case 'Preußen Münster':
    case 'Preussen Münster':
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
    case 'FC Kaiserslautern':
      return 'Kaiserslautern';
    case 'Hertha BSC':
      return 'Hertha';
    case 'Fortuna Dusseldorf':
    case 'Fortuna Düsseldorf':
      return 'Düsseldorf';
    case 'Hannover 96':
      return 'Hannover';
    case 'Jahn Regensburg':
      return 'Regensburg';
    case 'SSV Jahn Regensburg':
      return 'Regensburg';
    case 'SpVgg Greuther Fürth':
    case 'SpVgg Greuther Furth':
      return 'Fürth';
    case 'FC Saarbrücken':
      return 'Saarbrücken';
    case 'Eintracht Braunschweig':
      return 'Braunschweig';
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

    // Eredivisie
    case 'GO Ahead Eagles':
      return 'GA Eagles';
    case 'Fortuna Sittard':
      return 'Sittard';
    case 'Sparta Rotterdam':
      return 'Rotterdam';
    case 'Almere City FC':
      return 'Almere';
    case 'NEC Nijmegen':
      return 'Nijmegen';

    // MLS
    case 'Nashville SC':
      return 'Nashville';
    case 'Los Angeles Galaxy':
      return 'LA Galaxy';
    case 'FC Cincinnati':
      return 'Cincinnati';
    case 'New England Revolution':
      return 'New England';
    case 'Columbus Crew':
      return 'Columbus';
    case 'CF Montreal':
      return 'Montreal';
    case 'Atlanta United FC':
      return 'Atlanta';
    case 'FC Dallas':
      return 'Dallas';
    case 'New York Red Bulls':
      return 'New York RB';
    case 'Chigago Fire':
      return 'Chicago';
    case 'Philadelphia Union':
      return 'Philadelphia';
    case 'Orlando City SC':
      return 'Orlando';
    case 'Portland Timbers':
      return 'Portland';
    case 'Sporting Kansas City':
      return 'Sporting KC';
    case 'St. Louis City':
      return 'St. Louis';
    case 'Houston Dynamo':
      return 'Houston';
    case 'Los Angeles FC':
      return 'LAFC';
    case 'Vancouver Whitecaps':
      return 'Whitecaps';
    case 'Colorado Rapids':
      return 'Rapids';
    case 'Seattle Sounders':
      return 'Seattle';
    case 'New York City FC':
      return 'New York FC';
    case 'Minnesota United FC':
      return 'Minnesota';
    case 'San Jose Earthquakes':
      return 'Earthquakes';

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
    case 'Union St. Gilloise':
      return 'St. Gilloise';
    case 'AZ Alkmaar':
      return 'Alkmaar';
    case 'Olympiakos Piraeus':
      return 'Olympiakos';
    case 'FC Porto':
      return 'Porto';
    case 'SC Braga':
      return 'Braga';
    case 'Rīgas FS':
      return 'Rīgas';
    case 'HJK helsinki':
      return 'Helsinki';
    case 'Hamrun Spartans':
      return 'Ħamrun';
    case 'Lincoln Red Imps FC':
      return 'Lincoln';
    case 'The New Saints':
      return 'Saints';
    case 'UE Santa Coloma':
      return 'Coloma';
    case 'Vikingur Reykjavik':
      return 'Víkingur';
    case 'Shamrock Rovers':
      return 'Shamrock';
    case 'Ordabasy':
      return 'Ordabassy';
    case 'Flora Tallinn':
      return 'Flora';
    case 'KI Klaksvik':
      return 'Klaksvík';
    case 'FC Differdange 03':
      return 'Differdange';
    case 'Dinamo Batumi':
      return 'Batumi';
    case 'Pyunik Yerevan':
      return 'Pyunik';
    case 'Egnatia Rrogozhinë':
      return 'Egnatia';
    case 'Sheriff Tiraspol':
      return 'Sheriff';
    case 'Zira':
      return 'Zirə';
    case 'FK Tobol Kostanay':
      return 'Tobol';
    case 'Corvinul Hunedoara':
      return 'Corvinul';
    case 'Botev Plovdiv':
      return 'Botev';
    case 'Wisla Krakow':
      return 'Wisła';

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
      return 'Bosnien';
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
    case 'Rep. Of Ireland':
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
