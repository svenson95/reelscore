import {
  STATUS_VALUE_ABANDONED,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_HALFTIME,
  STATUS_VALUE_POSTPONED,
  STATUS_VALUES_FINISHED,
  STATUS_VALUES_NOT_PLAYED,
  STATUS_VALUES_PLAYING,
  STATUS_VALUES_SCHEDULED,
} from '@reelscore-sdk/constants';
import type { StatusShort, StatusTypeScheduled } from '@reelscore-sdk/models';

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
  const isScheduled = STATUS_VALUES_SCHEDULED.includes(
    status as StatusTypeScheduled
  );

  const isPlaying = STATUS_VALUES_PLAYING.includes(status);
  const isHalftime = status === STATUS_VALUE_HALFTIME;
  const isPenalty = status === 'P';

  const isNotPlayed =
    status === STATUS_VALUE_POSTPONED ||
    status === STATUS_VALUE_CANCELLED ||
    status === STATUS_VALUE_ABANDONED ||
    STATUS_VALUES_NOT_PLAYED.includes(status);

  const isFinished = STATUS_VALUES_FINISHED.includes(status) || isNotPlayed;

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
