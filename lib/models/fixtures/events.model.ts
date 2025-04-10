import { PlayerId, PlayerName } from '../player.model';

export type EventTime = { elapsed: number; extra: null | number };
export const timeTotal = (e: EventDTO) => e.time.elapsed + (e.time.extra ?? 0);
export type EventTeam = {
  id: number;
  name: string;
  logo: string;
  goals: number;
};
export type EventPlayer = { id: PlayerId; name: PlayerName };
export type EventAssist = { id: PlayerId; name: PlayerName };
export type EventType = 'Goal' | 'Card' | 'subst' | 'Var';
export type EventDetail =
  | 'Normal Goal'
  | 'Own Goal'
  | 'Penalty'
  | 'Missed Penalty'
  | 'Yellow Card'
  | 'Red Card'
  | 'Tripping'
  | 'Roughing'
  | 'Argument'
  | 'Holding'
  | 'Delay of game'
  | 'Elbowing'
  | 'Unsportsmanlike conduct'
  | 'Serious foul'
  | 'Goal cancelled'
  | 'Goal Disallowed - handball'
  | 'Goal Disallowed - offside'
  | 'Diving'
  | 'Penalty confirmed'
  | 'Substitution'
  | 'Substitution 1'
  | 'Substitution 2'
  | 'Substitution 3'
  | 'Substitution 4'
  | 'Substitution 5'
  | 'Substitution 6'
  | 'Substitution 7'
  | 'Substitution 8'
  | 'Substitution 9'
  | 'Substitution 10';

export interface EventDTO {
  time: EventTime;
  team: EventTeam;
  player: EventPlayer;
  assist: EventAssist;
  type: EventType;
  detail: EventDetail;
  comments: string;
}

export type EventResult = { home: number; away: number };
export interface EventWithResult extends EventDTO {
  result: EventResult;
}
