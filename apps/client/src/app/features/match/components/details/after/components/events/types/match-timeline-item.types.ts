import type { EventWithResult } from '@reelscore-sdk/models';

export type TimelineItemKey = string;
export type MatchTimelineItem =
  | { type: 'spacer'; label: string; key: TimelineItemKey }
  | {
      type: 'event';
      event: EventWithResult;
      key: TimelineItemKey;
      shootoutResult?: EventWithResult['result'];
    };
