import type { EventDTO } from '@reelscore-sdk/models';

export const timeTotal = (event: EventDTO) =>
  event.time.elapsed + (event.time.extra ?? 0);

export type EventResult = { home: number; away: number };
export interface EventWithResult extends EventDTO {
  result: EventResult;
}

type HighlightSpacerType = 'halftime' | 'penalty-shootout';

type HighlightSpacer = {
  kind: 'spacer';
  type: HighlightSpacerType;
  label: string;
};

export type HighlightEvent = EventWithResult & {
  kind: 'event';
};

export type HighlightItem = HighlightEvent | HighlightSpacer;
