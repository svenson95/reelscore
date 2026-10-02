import type { EventWithResult } from '@reelscore-sdk/models';

export type MatchTimelineItem =
  | { type: 'spacer'; label: string; key: string }
  | {
      type: 'event';
      event: EventWithResult;
      key: string;
      shootoutResult?: EventWithResult['result'];
    };
