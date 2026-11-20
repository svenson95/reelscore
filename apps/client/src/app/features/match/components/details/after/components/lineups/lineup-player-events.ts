import type { EventWithResult } from '@reelscore-sdk/models';

export type LineupPlayerEvent = {
  type:
    | 'goal'
    | 'own-goal'
    | 'yellow-card'
    | 'red-card'
    | 'substitution-in'
    | 'substitution-out';
  minute: string;
  label: string;
  count?: number;
};

export function getLineupPlayerEvents(
  events: readonly EventWithResult[],
  teamId: number | null,
  playerId: number | null
): LineupPlayerEvent[] {
  if (teamId == null || playerId == null || playerId <= 0) return [];

  const playerEvents: LineupPlayerEvent[] = [];
  const substitutionEvents: LineupPlayerEvent[] = [];

  for (const event of events) {
    if (event.team.id !== teamId) continue;

    const minute = formatEventMinute(event);

    if (event.type === 'subst') {
      addSubstitutionEvents(substitutionEvents, event, playerId, minute);
      continue;
    }

    if (event.player.id !== playerId) continue;
    addPlayerEvent(playerEvents, event, minute);
  }

  return [...playerEvents, ...substitutionEvents];
}

function formatEventMinute(event: EventWithResult): string {
  return event.time.extra
    ? `${event.time.elapsed}+${event.time.extra}'`
    : `${event.time.elapsed}'`;
}

function addSubstitutionEvents(
  events: LineupPlayerEvent[],
  event: EventWithResult,
  playerId: number,
  minute: string
): void {
  if (event.player.id === playerId) {
    events.push({
      type: 'substitution-out',
      minute,
      label: `Ausgewechselt ${minute}`,
    });
  }

  if (event.assist.id === playerId) {
    events.push({
      type: 'substitution-in',
      minute,
      label: `Eingewechselt ${minute}`,
    });
  }
}

function addPlayerEvent(
  events: LineupPlayerEvent[],
  event: EventWithResult,
  minute: string
): void {
  if (event.type === 'Goal') {
    addGoalEvent(events, event, minute);
    return;
  }

  if (event.type === 'Card') {
    addCardEvent(events, event, minute);
  }
}

function addGoalEvent(
  events: LineupPlayerEvent[],
  event: EventWithResult,
  minute: string
): void {
  if (event.detail === 'Own Goal') {
    events.push({ type: 'own-goal', minute, label: `Eigentor ${minute}` });
    return;
  }

  if (event.detail !== 'Normal Goal' && event.detail !== 'Penalty') return;

  const existingGoal = events.find(
    (playerEvent) => playerEvent.type === 'goal'
  );
  if (!existingGoal) {
    events.push({ type: 'goal', minute, label: `Tor ${minute}` });
    return;
  }

  existingGoal.count = (existingGoal.count ?? 1) + 1;
  existingGoal.minute = `${existingGoal.minute}, ${minute}`;
  existingGoal.label = `${existingGoal.count} Tore: ${existingGoal.minute}`;
}

function addCardEvent(
  events: LineupPlayerEvent[],
  event: EventWithResult,
  minute: string
): void {
  if (event.detail === 'Yellow Card') {
    events.push({
      type: 'yellow-card',
      minute,
      label: `Gelbe Karte ${minute}`,
    });
  } else if (event.detail === 'Red Card') {
    events.push({ type: 'red-card', minute, label: `Rote Karte ${minute}` });
  }
}

export function ratingCategory(
  rating: string | null | undefined
): string | null {
  if (!rating?.trim()) return null;

  const value = Number(rating);
  if (!Number.isFinite(value) || value <= 0 || value > 10) return null;
  if (value <= 5) return 'rating-red';
  if (value <= 6) return 'rating-orange';
  if (value < 8) return 'rating-yellow';
  if (value < 9) return 'rating-green';
  return 'rating-bright-green';
}
