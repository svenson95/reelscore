export const abbreviationTeamName = (value: string): string => {
  switch (value) {
    // Bundesliga
    case 'Borussia Mönchengladbach':
    case 'Borussia Monchengladbach':
      return 'BMG';
    case 'SV Darmstadt 98':
      return 'D98';
    case 'Bayern München':
    case 'Bayern Munich':
      return 'FCB';
    case 'VfL Bochum':
    case 'Vfl Bochum':
      return 'BOC';
    case 'Eintracht Frankfurt':
      return 'SGE';
    case 'FC Koln':
    case '1.FC Köln':
    case '1. FC Köln':
      return 'KOE';
    case 'Bayer Leverkusen':
      return 'B04';
    case 'Union Berlin':
      return 'FCU';
    case '1899 Hoffenheim':
      return 'TSG';
    case '1. FC Heidenheim':
    case 'FC Heidenheim':
      return 'HDH';
    case 'Borussia Dortmund':
      return 'BVB';
    case 'VfL Wolfsburg':
      return 'WOB';
    case 'SC Freiburg':
      return 'SCF';
    case 'FSV Mainz 05':
      return 'M05';
    case 'FC Augsburg':
      return 'FCA';
    case 'VfB Stuttgart':
      return 'VFB';
    case 'Werder Bremen':
      return 'SVW';
    case 'FC St. Pauli':
      return 'STP';
    case 'Holstein Kiel':
      return 'KIE';
    case 'RB Leipzig':
      return 'RBL';

    // 2. Bundesliga
    case 'SC Paderborn 07':
      return 'SCP';
    case 'SSV Ulm 1846':
    case 'SSV ULM 1846':
      return 'ULM';
    case 'FC Schalke 04':
      return 'S04';
    case 'Karlsruher SC':
      return 'KSC';
    case 'Hamburger SV':
      return 'HSV';
    case 'Preußen Münster':
    case 'Preussen Münster':
    case 'Preussen Munster':
      return 'SCP';
    case '1. FC Nürnberg':
    case 'FC Nurnberg':
      return 'FCN';
    case '1. FC Magdeburg':
    case 'FC Magdeburg':
      return 'FCM';
    case 'SV Elversberg':
      return 'SVE';
    case '1. FC Kaiserslautern':
    case 'FC Kaiserslautern':
      return 'FCK';
    case 'Hertha BSC':
      return 'BSC';
    case 'Fortuna Dusseldorf':
    case 'Fortuna Düsseldorf':
      return 'F95';
    case 'Hannover 96':
      return 'H96';
    case 'Jahn Regensburg':
    case 'SSV Jahn Regensburg':
      return 'SSV';
    case 'SpVgg Greuther Fürth':
    case 'SpVgg Greuther Furth':
      return 'SGF';
    case 'FC Saarbrücken':
      return 'FCS';
    case 'Eintracht Braunschweig':
      return 'EBS';
    case 'SV Sandhausen':
      return 'SVS';
    case 'Hansa Rostock':
      return 'HRO';
    case 'VfR Aalen':
      return 'VFR';
    case 'Dynamo Dresden':
      return 'SGD';
    case 'Arminia Bielefeld':
      return 'DSC';

    // 3. Liga
    case 'Kickers Offenbach':
      return 'OFC';
    case 'FC Ingolstadt 04':
      return 'FCI';
    case 'Borussia Hildesheim':
      return 'BHI';
    case 'Würzburger Kickers':
      return 'FWK';
    case 'Rot-Weiß Essen':
      return 'RWE';
    case 'TuS Koblenz':
      return 'KOB';
    case 'Sportfreunde Lotte':
      return 'SFL';
    case 'SV Meppen':
      return 'MEP';
    case 'Teutonia Ottensen':
      return 'FCT';
    case 'Greifswalder FC':
      return 'GFC';

    // Premiere League
    case 'Nottingham Forest':
      return 'NFC';
    case 'Manchester United':
      return 'MUN';
    case 'Manchester City':
      return 'MCI';
    case 'Tottenham':
      return 'TOT';
    case 'Crystal Palace':
      return 'CRY';
    case 'Aston Villa':
      return 'AVL';
    case 'Liverpool':
      return 'LIV';
    case 'Chelsea':
      return 'CHE';
    case 'Arsenal':
      return 'ARS';
    case 'Leeds United':
      return 'LEE';
    case 'Southampton':
      return 'SOU';
    case 'West Ham':
      return 'WHU';
    case 'Wolves':
      return 'WOL';
    case 'Brighton':
      return 'BHA';
    case 'Burnley':
      return 'BUR';
    case 'Fulham':
      return 'FUL';
    case 'Sheffield Utd':
      return 'SHU';
    case 'Luton':
      return 'LUT';
    case 'Newcastle':
      return 'NEW';
    case 'Bournemouth':
      return 'BOU';
    case 'Brentford':
      return 'BRE';
    case 'Everton':
      return 'EVE';
    case 'Leicester':
      return 'LEI';
    case 'Ipswich':
      return 'IPS';

    // Ligue 1
    case 'Paris Saint Germain':
      return 'PSG';
    case 'Stade Brestois 29':
      return 'B29';
    case 'LE Havre':
      return 'HAV';
    case 'Lens':
      return 'RCL';
    case 'Saint-Etienne':
    case 'Saint Etienne':
      return 'STE';
    case 'Clermont Foot':
      return 'CF63';
    case 'Lyon':
      return 'OLY';
    case 'Marseille':
      return 'OMA';
    case 'Monaco':
      return 'ASM';
    case 'Nantes':
      return 'NAN';
    case 'Lille':
      return 'OSC';
    case 'Montpellier':
      return 'HSC';
    case 'Angers':
      return 'ANG';
    case 'Nice':
      return 'NIC';
    case 'Auxerre':
      return 'AJA';
    case 'Reims':
      return 'REI';
    case 'Rennes':
      return 'REN';
    case 'Toulouse':
      return 'TOU';
    case 'Strasbourg':
      return 'RCS';

    // La Liga
    case 'Athletic Club':
      return 'ATH';
    case 'Atletico Madrid':
      return 'ATM';
    case 'Cadiz':
      return 'CAD';
    case 'Almeria':
      return 'ALM';
    case 'Granada CF':
      return 'GCF';
    case 'Rayo Vallecano':
      return 'RVM';
    case 'Real Sociedad':
      return 'RSO';
    case 'Leganes':
      return 'LEG';
    case 'Real Madrid':
      return 'RMA';
    case 'Barcelona':
      return 'FCB';
    case 'Girona':
      return 'GIR';
    case 'Getafe':
      return 'GET';
    case 'Espanyol':
      return 'ESP';
    case 'Valladolid':
      return 'RVL';
    case 'Real Betis':
      return 'RBT';
    case 'Sevilla':
      return 'SEV';
    case 'Alaves':
      return 'ALA';
    case 'Las Palmas':
      return 'LPA';
    case 'Osasuna':
      return 'OSA';
    case 'Celta Vigo':
      return 'CEL';
    case 'Villarreal':
      return 'VIL';
    case 'Valencia':
      return 'VAL';
    case 'Mallorca':
      return 'MLL';

    // Serie A
    case 'AC Milan':
      return 'ACM';
    case 'AS Roma':
      return 'ASR';
    case 'Fiorentina':
    case 'AC Florenz':
      return 'FIO';
    case 'Genoa':
      return 'GEN';
    case 'Venezia':
      return 'VEN';
    case 'Torino':
      return 'TOR';
    case 'Napoli':
      return 'NAP';
    case 'Juventus':
      return 'JUV';
    case 'Bologna':
      return 'BOL';
    case 'Empoli':
      return 'EMP';
    case 'Lazio':
      return 'LAZ';
    case 'Sassuolo':
      return 'SAS';
    case 'Spezia':
      return 'SPE';
    case 'Udinese':
      return 'UDI';
    case 'Atalanta':
      return 'ATA';
    case 'Inter':
      return 'INT';
    case 'Salernitana':
      return 'SAL';
    case 'Verona':
      return 'VER';
    case 'Monza':
      return 'MON';
    case 'Como':
      return 'COM';
    case 'Cagliari':
      return 'CAG';
    case 'Parma':
      return 'PAR';
    case 'Lecce':
      return 'LEC';

    // Europa
    case 'Slavia Praha':
      return 'SLP';
    case 'Dinamo Minsk':
      return 'DIN';
    case 'Heart Of Midlothian':
      return 'HOM';
    case 'TSC Backa Topola':
      return 'TBT';
    case 'Maccabi Tel Aviv':
      return 'MTA';
    case 'Apoel Nicosia':
      return 'APO';
    case 'Rapid Vienna':
      return 'SCR';
    case 'Borac Banja Luka':
      return 'BBL';
    case 'Ferencvarosi TC':
      return 'FTC';
    case 'Plzen':
      return 'PLZ';
    case 'Ajax':
      return 'AJX';
    case 'FC Carl Zeiss Jena':
      return 'JEN';
    case 'FC Midtjylland':
      return 'MID';
    case 'Slovan Bratislava':
      return 'SLO';
    case 'FK Crvena Zvezda':
      return 'RSB';
    case 'Bodo/Glimt':
      return 'BOD';
    case 'Red Bull Salzburg':
      return 'RBS';
    case 'BSC Young Boys':
      return 'YBB';
    case 'IF elfsborg':
      return 'ELF';
    case 'Malmo FF':
      return 'MAL';
    case 'Sparta Praha':
      return 'SPR';
    case 'Dynamo Kyiv':
      return 'DKY';
    case 'PSV Eindhoven':
      return 'PSV';
    case 'Sporting CP':
      return 'SPO';
    case 'Shakhtar Donetsk':
      return 'SHA';
    case 'Club Brugge KV':
      return 'BRU';
    case 'Benfica':
      return 'BEN';
    case 'Dinamo Zagreb':
      return 'DZA';
    case 'Feyenoord':
      return 'FEY';
    case 'Sturm Graz':
      return 'STG';
    case 'Celtic':
      return 'CEL';
    case 'Anderlecht':
      return 'AND';
    case 'Union St. Gilloise':
      return 'STG';
    case 'Twente':
      return 'TWE';
    case 'AZ Alkmaar':
      return 'ALK';
    case 'FC Porto':
      return 'POR';
    case 'Olympiakos Piraeus':
      return 'OLY';
    case 'SC Braga':
      return 'BRA';
    case 'Rangers':
      return 'RAN';
    case 'Galatasaray':
      return 'GAL';
    case 'Fenerbahce':
      return 'FEN';
    case 'Besiktas':
      return 'BES';
    case 'Qarabag':
      return 'QAR';
    case 'Ludogorets':
      return 'LUD';
    case 'Rīgas FS':
      return 'RFS';
    case 'Panevėžys':
      return 'PAN';
    case 'HJK helsinki':
      return 'HJK';
    case 'Hamrun Spartans':
      return 'HAM';
    case 'Lincoln Red Imps FC':
      return 'LIN';
    case 'The New Saints':
      return 'TNS';
    case 'Dečić':
      return 'DEC';
    case 'UE Santa Coloma':
      return 'SAC';
    case 'Ballkani':
      return 'BAL';
    case 'Vikingur Reykjavik':
      return 'VIK';
    case 'Shamrock Rovers':
      return 'SHA';
    case 'Virtus':
      return 'VIR';
    case 'FCSB':
      return 'BUK';
    case 'Ordabasy':
      return 'ORD';
    case 'FC Petrocub-Hîncesti':
      return 'PET';
    case 'Flora Tallinn':
      return 'FLT';
    case 'Celje':
      return 'CEL';
    case 'Struga':
      return 'STR';
    case 'Larne':
      return 'LAR';
    case 'KI Klaksvik':
      return 'KIK';
    case 'FC Differdange 03':
      return 'DIF';
    case 'Dinamo Batumi':
      return 'DIN';
    case 'Pyunik Yerevan':
      return 'PYU';
    case 'Egnatia Rrogozhinë':
      return 'EGR';
    case 'Pafos':
      return 'PAF';
    case 'Sheriff Tiraspol':
      return 'SHE';
    case 'Zira':
      return 'ZIR';
    case 'Ružomberok':
      return 'RUZ';
    case 'FK Tobol Kostanay':
      return 'TOB';
    case 'Paks':
      return 'PAK';
    case 'Corvinul Hunedoara':
      return 'COR';
    case 'Botev Plovdiv':
      return 'BOT';
    case 'Maribor':
      return 'MAR';
    case 'Wisla Krakow':
      return 'WIS';
    case 'Llapi':
      return 'LLA';

    // International
    case 'Northern Ireland':
      return 'NIR';
    case 'Rep. Of Ireland':
      return 'IRL';
    case 'Azerbaijan':
      return 'AZE';
    case 'Sweden':
      return 'SWE';
    case 'Croatia':
      return 'CRO';
    case 'Denmark':
      return 'DEN';
    case 'Switzerland':
      return 'SUI';
    case 'Scotland':
      return 'SCO';
    case 'Poland':
      return 'POL';
    case 'Serbia':
      return 'SRB';
    case 'Spain':
      return 'ESP';
    case 'Bulgaria':
      return 'BUL';
    case 'Estonia':
      return 'EST';
    case 'Slovakia':
      return 'SVK';
    case 'Luxembourg':
      return 'LUX';
    case 'Lithuania':
      return 'LTU';
    case 'Cyprus':
      return 'CYP';
    case 'France':
      return 'FRA';
    case 'Italy':
      return 'ITA';
    case 'Belgium':
      return 'BEL';
    case 'Romania':
      return 'ROU';
    case 'Faroe Islands':
      return 'FRO';
    case 'FYR Macedonia':
      return 'MKD';
    case 'Armenia':
      return 'ARM';
    case 'Latvia':
      return 'LVA';
    case 'Moldova':
      return 'MDA';
    case 'Netherlands':
      return 'NED';
    case 'Bosnia & Herzegovina':
      return 'BIH';
    case 'Germany':
      return 'GER';
    case 'Hungary':
      return 'HUN';
    case 'Kazakhstan':
      return 'KAZ';
    case 'Norway':
      return 'NOR';
    case 'Iceland':
      return 'ISL';
    case 'Slovenia':
      return 'SVN';
    case 'Austria':
      return 'AUT';
    case 'Türkiye':
      return 'TUR';
    case 'Georgia':
      return 'GEO';
    case 'Czech Republic':
      return 'CZE';
    case 'Greece':
      return 'GRE';
    case 'Finland':
      return 'FIN';
    case 'Albania':
      return 'ALB';
    case 'Montenegro':
      return 'MNE';
    case 'Israel':
      return 'ISR';
    case 'Kosovo':
      return 'KOS';
    case 'Liechtenstein':
      return 'LIE';
    case 'San Marino':
      return 'SMR';
    case 'Belarus':
      return 'BLR';
    case 'Portugal':
      return 'POR';
    case 'England':
      return 'ENG';
    case 'Ukraine':
      return 'UKR';
    case 'Malta':
      return 'MLT';
    case 'Gibraltar':
      return 'GIB';
    case 'Wales':
      return 'WAL';
    case 'Andorra':
      return 'AND';

    default:
      return value;
  }
};
