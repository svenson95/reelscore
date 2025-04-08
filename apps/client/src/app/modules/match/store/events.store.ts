import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import {
  EventDTO,
  EventResult,
  EventWithResult,
  FixtureId,
  MatchTeams,
  RapidEventsDTO,
  timeTotal,
} from '@lib/models';

import { StateHandler } from '../../../shared';
import { HttpFixtureEventsService } from '../services';

type EventsState = StateHandler<{ events: EventWithResult[] | null }>;

const initialState: EventsState = {
  events: null,
  isLoading: false,
  error: null,
};

export const EventsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureEventsService)) => ({
    async loadEvents(fixtureId: FixtureId, teams: MatchTeams): Promise<void> {
      patchState(store, { isLoading: true });

      http.getFixtureEvents(fixtureId).subscribe({
        next: (events) => {
          if (!events || !teams) {
            return patchState(store, {
              events: null,
              isLoading: false,
              error: 'Events not found',
            });
          }

          patchState(store, {
            events: mappedEvents(events, teams),
            isLoading: false,
            error: events ? null : 'Events not found',
          });
        },
        error: (error) =>
          patchState(store, {
            events: null,
            isLoading: false,
            error,
          }),
      });
    },
    async reset(): Promise<void> {
      patchState(store, initialState);
    },
  }))
);

const mappedEvents = (
  events: RapidEventsDTO,
  teams: MatchTeams
): EventWithResult[] =>
  events.response.map((e) => ({
    ...e,
    result: getTeamGoals(events.response, e, teams),
  }));

const getTeamGoals = (
  events: EventDTO[],
  event: EventDTO,
  teams: MatchTeams
): EventResult => {
  if (teams === undefined) throw new Error('Teams not found in fixture');
  const goals = events.filter(
    (e) => e.type === 'Goal' && e.detail !== 'Missed Penalty'
  );
  const elapsed = goals.filter((e) => timeTotal(e) <= timeTotal(event));
  const home = elapsed.filter((e) => e.team.id === teams.home.id).length;
  const away = elapsed.filter((e) => e.team.id === teams.away.id).length;
  return { home, away };
};
