import { BaseDTO } from './base-dto.model';

export type EventTime = { elapsed: number; extra: number };
export type EventTeam = { id: number; name: string; logo: string };
export type EventPlayer = { id: number; name: string };
export type EventAssist = { id: number; name: string };
export type EventType = 'Goal' | 'Card' | 'Subst' | 'Var';
export type EventDetail =
  | 'Normal Goal'
  | 'Own Goal'
  | 'Penalty'
  | 'Missed Penalty'
  | 'Yellow Card'
  | 'Red Card'
  | 'Goal cancelled'
  | 'Penalty confirmed'
  | 'Substitution'
  | 'Substitution [1]'
  | 'Substitution [2]'
  | 'Substitution [3]'
  | 'Substitution [4]'
  | 'Substitution [5]'
  | 'Substitution [6]'
  | 'Substitution [7]'
  | 'Substitution [8]'
  | 'Substitution [9]'
  | 'Substitution [10]';

export type FixtureEventsDTO = BaseDTO<FixtureEventsResponse>;
export interface FixtureEventsResponse {
  time: EventTime;
  team: EventTeam;
  player: EventPlayer;
  assist: EventAssist;
  type: EventType;
  detail: EventDetail;
  comments: string;
}
