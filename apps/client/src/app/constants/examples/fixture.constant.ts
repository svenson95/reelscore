import { Match } from '../../models';

export const MATCH_EXAMPLES: Match[] = [
  {
    id: '1',
    homeTeam: 'FC Bayern München',
    awayTeam: '1. FC Köln',
    date: new Date('05/17/2024 20:30'),
    state: 'finished',
    result: { half_time: '1-0', full_time: '3-0' },
    priority: 'mid',
  },
  {
    id: '2',
    homeTeam: 'Borussia Dortmund',
    awayTeam: 'RB Leipzig',
    date: new Date('05/18/2024 13:30'),
    state: 'finished',
    result: { half_time: '1-1', full_time: '1-3' },
    priority: 'high',
  },
  {
    id: '3',
    homeTeam: 'Freiburg',
    awayTeam: 'Augsburg',
    date: new Date('05/18/2024 15:30'),
    state: 'upcoming',
    result: null,
    priority: 'low',
  },
  {
    id: '4',
    homeTeam: 'Leverkusen',
    awayTeam: 'Hoffenheim',
    date: new Date('05/18/2024 18:30'),
    state: 'upcoming',
    result: null,
    priority: 'high',
  },
  {
    id: '5',
    homeTeam: 'Union Berlin',
    awayTeam: 'Hamburger SV',
    date: new Date('05/18/2024 20:45'),
    state: 'upcoming',
    result: null,
    priority: 'mid',
  },
];

export const MATCH_EXAMPLES_2: Match[] = [
  {
    id: '1',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Real Madrid',
    date: new Date('05/18/2024 16:00'),
    state: 'finished',
    result: { half_time: '1-2', full_time: '3-3' },
    priority: 'high',
  },
];
