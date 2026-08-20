import {
  STATUS_TYPES_FINISHED,
  STATUS_TYPES_NOT_PLAYED,
  STATUS_TYPES_PLAYING,
  STATUS_TYPES_SCHEDULED,
  STATUS_VALUE_ABANDONED,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_HALFTIME,
  STATUS_VALUE_POSTPONED,
  type StatusShort,
  type StatusTypeScheduled,
} from '@lib/models';

export interface FixtureStatusState {
  status: StatusShort;
  isScheduled: boolean;
  isPlaying: boolean;
  isHalftime: boolean;
  isPenalty: boolean;
  isFinished: boolean;
  isNotPlayed: boolean;
  isLive: boolean;
}

export function getFixtureStatusState(status: StatusShort): FixtureStatusState {
  const isScheduled = STATUS_TYPES_SCHEDULED.includes(
    status as StatusTypeScheduled
  );

  const isPlaying = STATUS_TYPES_PLAYING.includes(status);
  const isHalftime = status === STATUS_VALUE_HALFTIME;
  const isPenalty = status === 'P';

  const isNotPlayed =
    status === STATUS_VALUE_POSTPONED ||
    status === STATUS_VALUE_CANCELLED ||
    status === STATUS_VALUE_ABANDONED ||
    STATUS_TYPES_NOT_PLAYED.includes(status);

  const isFinished = STATUS_TYPES_FINISHED.includes(status) || isNotPlayed;

  const isLive = isPlaying || isHalftime || isPenalty;

  return {
    status,
    isScheduled,
    isPlaying,
    isHalftime,
    isPenalty,
    isFinished,
    isNotPlayed,
    isLive,
  };
}
