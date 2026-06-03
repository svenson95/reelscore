import type { CompetitionId } from '@lib/models';

export const isCompetitionWithMultipleGroups = (
  competitionId: CompetitionId
): boolean => {
  const COMPETITIONS_WITH_MULTIPLE_GROUPS = [1, 4, 5, 31, 32];
  return COMPETITIONS_WITH_MULTIPLE_GROUPS.includes(competitionId);
};

// TODO: check why const from lib cause api crash
// lib/models/fixtures/status.model.ts copy
export const STATUS_TYPES_SCHEDULED: readonly string[] = ['TBD', 'NS'] as const;
export type StatusTypeScheduled = (typeof STATUS_TYPES_SCHEDULED)[number];
export const STATUS_VALUE_HALFTIME = 'HT' as const;
export type StatusValueHalftime = (typeof STATUS_VALUE_HALFTIME)[number];
export const STATUS_TYPES_PLAYING: readonly string[] = [
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

export const STATUS_TYPES_FINISHED: readonly string[] = [
  'FT',
  'AET',
  'PEN',
] as const;
export type StatusTypeFinished = (typeof STATUS_TYPES_FINISHED)[number];
export const STATUS_VALUE_POSTPONED = 'PST' as const;
export type StatusTypePostponed = (typeof STATUS_VALUE_POSTPONED)[number];
export const STATUS_VALUE_CANCELLED = 'CANC' as const;
export type StatusTypeCancelled = (typeof STATUS_VALUE_CANCELLED)[number];
export const STATUS_VALUE_ABANDONED = 'ABD' as const;
export type StatusTypeAbandoned = (typeof STATUS_VALUE_ABANDONED)[number];
export const STATUS_TYPES_NOT_PLAYED: readonly string[] = [
  'AWD', // Technical Loss
  'WO', // WalkOver, victory by forfeit or absence of competitor
] as const;
export type StatusTypeNotPlayed = (typeof STATUS_TYPES_NOT_PLAYED)[number];
