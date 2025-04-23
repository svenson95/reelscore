export type StatusLong =
  | 'Time To Be Defined'
  | 'Not Started'
  | 'First Half, Kick Off'
  | 'Halftime'
  | 'Second Half, 2nd Half Started'
  | 'Extra Time'
  | 'Break Time'
  | 'Penalty in Progress'
  | 'Match Suspended'
  | 'Match Interrupted'
  | 'Match Finished'
  | 'Match Postponed'
  | 'Match Cancelled'
  | 'Match Abandoned'
  | 'Technical Loss'
  | 'WalkOver'
  | 'In Progress';
export type StatusShort =
  | StatusTypeScheduled
  | StatusTypePlaying
  | StatusTypeFinished
  | StatusTypePostponed
  | StatusTypeCancelled
  | StatusTypeAbandoned
  | StatusTypeNotPlayed
  | 'WO';

export const STATUS_TYPES_SCHEDULED = ['TBD', 'NS'] as const;
export type StatusTypeScheduled = (typeof STATUS_TYPES_SCHEDULED)[number];
export const STATUS_VALUE_HALFTIME = ['HT'] as const;
export type StatusValueHalftime = (typeof STATUS_VALUE_HALFTIME)[number];
export const STATUS_TYPES_PLAYING = [
  '1H',
  ...STATUS_VALUE_HALFTIME,
  '2H',
  'ET', // Extra time in play
  'BT', // Break during extra time
  'P', // Penaly played after extra time
  'SUSP', // Suspended by referee's decision, may be rescheduled another day
  'INT', // Interrupted by referee's decision, should resume in a few minutes
  'LIVE', // indicates a fixture in progress but the data indicating the half-time or elapsed time are not available
] as const;
export type StatusTypePlaying = (typeof STATUS_TYPES_PLAYING)[number];

export const STATUS_TYPES_FINISHED = ['FT', 'AET', 'PEN'] as const;
export type StatusTypeFinished = (typeof STATUS_TYPES_FINISHED)[number];

export type StatusTypePostponed = 'PST';
export type StatusTypeCancelled = 'CANC';
export type StatusTypeAbandoned = 'ABD';
export const STATUS_TYPES_NOT_PLAYED = [
  'AWD', // Technical Loss
  'WO', // WalkOver, victory by forfeit or absence of competitor
] as const;
export type StatusTypeNotPlayed = (typeof STATUS_TYPES_NOT_PLAYED)[number];
