import type { EventWithResult } from '@reelscore-sdk/models';

export const SECOND_YELLOW_CARD_COMMENT = 'Second Yellow Card';

export function mergeSecondYellowCardEvents(
  events: EventWithResult[]
): EventWithResult[] {
  const consumedEvents = new Set<number>();
  const mergedEvents: EventWithResult[] = [];

  for (let index = 0; index < events.length; index++) {
    if (consumedEvents.has(index)) {
      continue;
    }

    const event = events[index];
    const matchingCardIndex = events.findIndex(
      (candidate, candidateIndex) =>
        candidateIndex > index &&
        !consumedEvents.has(candidateIndex) &&
        isSecondYellowCardPair(event, candidate)
    );

    if (matchingCardIndex === -1) {
      mergedEvents.push(event);
      continue;
    }

    consumedEvents.add(matchingCardIndex);
    mergedEvents.push({
      ...event,
      comments: SECOND_YELLOW_CARD_COMMENT,
    });
  }

  return mergedEvents;
}

function isSecondYellowCardPair(
  firstEvent: EventWithResult,
  secondEvent: EventWithResult
): boolean {
  if (
    firstEvent.type !== 'Card' ||
    secondEvent.type !== 'Card' ||
    firstEvent.team.id !== secondEvent.team.id ||
    getPlayerIdentifier(firstEvent) !== getPlayerIdentifier(secondEvent) ||
    getPlayerIdentifier(firstEvent) === null ||
    getTotalMinute(firstEvent) !== getTotalMinute(secondEvent)
  ) {
    return false;
  }

  return (
    (firstEvent.detail === 'Yellow Card' &&
      secondEvent.detail === 'Red Card') ||
    (firstEvent.detail === 'Red Card' && secondEvent.detail === 'Yellow Card')
  );
}

function getTotalMinute(event: EventWithResult): number {
  return event.time.elapsed + (event.time.extra ?? 0);
}

function getPlayerIdentifier(event: EventWithResult): number | string | null {
  if (event.player.id) {
    return event.player.id;
  }

  return event.player.name || null;
}
