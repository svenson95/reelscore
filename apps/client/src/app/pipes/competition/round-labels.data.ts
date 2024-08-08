export const translatedCompetitionRound = (value: string): string => {
  const types = [
    'Regular Season',
    '1st Round',
    '2nd Round',
    '3rd Round',
    '1st Qualifying Round',
    '2nd Qualifying Round',
    '3rd Qualifying Round',
  ];
  const type = types.find((t) => value.includes(t));
  switch (type) {
    case 'Regular Season':
      return roundString(value);
    case '1st Round':
      return '1. Runde';
    case '2nd Round':
      return '2. Runde';
    case '3rd Round':
      return '3. Runde';
    case '1st Qualifying Round':
      return '1. Qualifikationsrunde';
    case '2nd Qualifying Round':
      return '2. Qualifikationsrunde';
    case '3rd Qualifying Round':
      return '3. Qualifikationsrunde';
    default:
      return value;
  }
};

const roundString = (round: string): string => {
  const idx = round.lastIndexOf('-') + 2;
  return round.slice(idx, round.length);
};
