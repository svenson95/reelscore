import type { EventWithResult } from '@reelscore-sdk/models';

export type MatchTimelineEvent = EventWithResult & {
  isSecondYellowCard?: boolean;
};

export type MatchTimelineItem =
  | { type: 'spacer'; label: string; key: string }
  | {
      type: 'event';
      event: MatchTimelineEvent;
      key: string;
      shootoutResult?: EventWithResult['result'];
    };
