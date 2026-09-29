import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RealtimeUpdateRegistryService } from '@app/shared';
import type { EventDTO, FixtureDTO } from '@lib/models';
import {
  createOperationResponse,
  createRapidEvents,
} from '../../../../testing/factories/realtime.factory';
import { EXAMPLE_FIXTURE } from '../../../../testing/fixtures.mock';

import { MatchEventsComponent } from '../components/details/after/components';
import { MatchHighlightsComponent } from '../components/match-header/components';
import {
  AnalysesStore,
  EvaluationsStore,
  EventsStore,
  FixtureStandingsStore,
  FixtureStore,
  LatestFixturesStore,
  StatisticsStore,
} from '../stores';

import { HttpFixtureEventsService } from './http/events.service';
import { HttpFixtureService } from './http/fixture.service';
import { MatchRealtimeService } from './match-realtime.service';

@Component({
  imports: [MatchEventsComponent, MatchHighlightsComponent],
  template: `
    <rs-match-events [data]="events.events() ?? []" />
    <rs-match-highlights
      [data]="fixture.fixture()!.data"
      [highlights]="fixture.fixture()!.highlights"
    />
  `,
})
class TestMatchComponent {
  readonly fixture = inject(FixtureStore);
  readonly events = inject(EventsStore);
}

describe('Match realtime report and highlights', () => {
  const fixtureId = Number(EXAMPLE_FIXTURE.fixture.id);
  const goal: EventDTO = {
    time: { elapsed: 20, extra: null },
    team: { ...EXAMPLE_FIXTURE.teams.home, goals: 1 },
    player: { id: 1, name: 'Live scorer' },
    assist: { id: 2, name: 'Assist' },
    type: 'Goal',
    detail: 'Normal Goal',
    comments: '',
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestMatchComponent],
      providers: [
        MatchRealtimeService,
        FixtureStore,
        EventsStore,
        {
          provide: HttpFixtureService,
          useValue: {
            getFixture: () =>
              of({
                data: {
                  ...EXAMPLE_FIXTURE,
                  score: {
                    ...EXAMPLE_FIXTURE.score,
                    halftime: { home: null, away: null },
                  },
                  fixture: {
                    ...EXAMPLE_FIXTURE.fixture,
                    status: { ...EXAMPLE_FIXTURE.fixture.status, short: '1H' },
                  },
                },
                highlights: [],
              }),
          },
        },
        {
          provide: HttpFixtureEventsService,
          useValue: { getFixtureEvents: () => of(createRapidEvents()) },
        },
        ...[
          AnalysesStore,
          EvaluationsStore,
          FixtureStandingsStore,
          LatestFixturesStore,
          StatisticsStore,
        ].map((provide) => ({
          provide,
          useValue: {
            loadAnalyses: jest.fn(),
            loadEvaluations: jest.fn(),
            loadFixtureStandings: jest.fn(),
            loadLatestFixtures: jest.fn(),
            loadStatistics: jest.fn(),
          },
        })),
      ],
    });
    await TestBed.inject(FixtureStore).loadFixture(fixtureId);
    TestBed.inject(MatchRealtimeService).register(fixtureId);
  });

  const updateEvents = (events: EventDTO[], id: number = fixtureId): void => {
    TestBed.inject(RealtimeUpdateRegistryService).updateEvents([
      {
        fixtureId: id,
        operation: createOperationResponse([
          {
            ...createRapidEvents(),
            parameters: { fixture: String(id) },
            response: events,
          },
        ]),
      },
    ]);
  };

  it('renders new events, corrections and removals without duplicates', () => {
    const view = TestBed.createComponent(TestMatchComponent);
    view.detectChanges();
    const root: HTMLElement = view.nativeElement;

    const yellowCard: EventDTO = {
      ...goal,
      time: { elapsed: 25, extra: null },
      player: { id: 3, name: 'Booked player' },
      type: 'Card',
      detail: 'Yellow Card',
    };
    updateEvents([goal, yellowCard]);
    view.detectChanges();
    expect(root.querySelector('rs-match-events')?.textContent).toContain(
      'Live scorer'
    );
    expect(root.querySelector('rs-match-events')?.textContent).toContain(
      'Booked player'
    );
    expect(root.querySelector('rs-match-highlights')?.textContent).toContain(
      'Live scorer'
    );
    expect(
      root.querySelector('rs-match-highlights')?.textContent
    ).not.toContain('Booked player');

    updateEvents([goal, yellowCard]);
    view.detectChanges();
    expect(root.querySelectorAll('rs-match-events .event-row')).toHaveLength(2);
    expect(
      root.querySelectorAll('rs-match-highlights .event-row')
    ).toHaveLength(1);

    updateEvents([{ ...goal, player: { id: 4, name: 'Corrected scorer' } }]);
    view.detectChanges();
    expect(root.textContent).not.toContain('Live scorer');
    expect(root.querySelector('rs-match-highlights')?.textContent).toContain(
      'Corrected scorer'
    );

    updateEvents([]);
    view.detectChanges();
    expect(root.querySelectorAll('.event-row')).toHaveLength(0);
  });

  it('updates report phases and highlight separators on fixture-only updates', () => {
    updateEvents([goal, { ...goal, time: { elapsed: 40, extra: null } }]);
    const view = TestBed.createComponent(TestMatchComponent);
    view.detectChanges();
    const root: HTMLElement = view.nativeElement;
    expect(root.querySelector('rs-match-events')?.textContent).not.toContain(
      'ENDE'
    );
    expect(
      root.querySelector('rs-match-highlights')?.textContent
    ).not.toContain('Halbzeit');

    const updated: FixtureDTO = {
      ...EXAMPLE_FIXTURE,
      fixture: {
        ...EXAMPLE_FIXTURE.fixture,
        status: { ...EXAMPLE_FIXTURE.fixture.status, short: 'FT' },
      },
      score: { ...EXAMPLE_FIXTURE.score, halftime: { home: 1, away: 0 } },
    };
    TestBed.inject(RealtimeUpdateRegistryService).updateFixtures([updated]);
    view.detectChanges();
    expect(root.querySelector('rs-match-events')?.textContent).toContain(
      'ENDE'
    );
    expect(root.querySelector('rs-match-highlights')?.textContent).toContain(
      'Halbzeit'
    );
    expect(
      root.querySelectorAll('rs-match-highlights .event-row')
    ).toHaveLength(2);
  });

  it('ignores other fixtures and unregisters on cleanup', () => {
    const unregister = TestBed.inject(MatchRealtimeService).register(fixtureId);
    updateEvents([goal], fixtureId + 1);
    expect(TestBed.inject(EventsStore).events()).toEqual([]);
    unregister();
    updateEvents([goal]);
    expect(TestBed.inject(EventsStore).events()).toEqual([]);
    expect(TestBed.inject(FixtureStore).fixture()?.highlights).toEqual([]);
  });
});
