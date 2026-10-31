import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import { timeTotal } from '@reelscore-sdk/helpers';
import type {
  EventDTO,
  EventResult,
  EventWithResult,
  FixtureIdParameter,
  MatchTeams,
  RapidEventsDTO,
} from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpFixtureEventsService } from '../data-access';

type EventsState = StateHandler<{ events: EventWithResult[] | null }>;

const initialState: EventsState = {
  events: null,
  isLoading: false,
  error: null,
};

export const EventsStore = signalStore(
  withState(initialState),

  withMethods((store, http = inject(HttpFixtureEventsService)) => {
    let latestRequestId = 0;

    const patchEvents = (events: RapidEventsDTO, teams: MatchTeams): void => {
      patchState(store, {
        events: mappedEvents(events, teams),
        isLoading: false,
        error: null,
      });
    };

    return {
      loadEvents(
        {
          fixtureId,
          teams,
          onEventsLoaded,
        }: {
          fixtureId: FixtureIdParameter;
          teams: MatchTeams;
          onEventsLoaded?: (events: EventDTO[]) => void;
        },
        silent = false
      ): void {
        const requestId = ++latestRequestId;
        patchState(store, {
          ...(silent ? {} : { events: null }),
          isLoading: !silent,
          error: null,
        });

        http
          .getFixtureEvents(fixtureId)
          .pipe(retry(errorHandler))
          .subscribe({
            next: (events) => {
              if (requestId !== latestRequestId) return;

              if (!events || !teams) {
                patchState(store, {
                  events: null,
                  isLoading: false,
                  error: silent ? store.error() : 'Events not found',
                });

                return;
              }

              if (!events.response.length) {
                onEventsLoaded?.([]);
                patchState(store, {
                  events: null,
                  isLoading: false,
                  error: silent ? store.error() : null,
                });

                return;
              }

              patchEvents(events, teams);
              onEventsLoaded?.(events.response);
            },

            error: (error) => {
              if (requestId !== latestRequestId) return;

              patchState(store, {
                events: silent ? store.events() : null,
                isLoading: false,
                error,
              });
            },
          });
      },

      updateEvents(events: RapidEventsDTO, teams: MatchTeams): void {
        patchEvents(events, teams);
      },

      reset(): void {
        latestRequestId++;
        patchState(store, initialState);
      },
    };
  })
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
