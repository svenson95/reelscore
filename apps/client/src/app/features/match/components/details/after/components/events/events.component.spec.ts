import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { GetFixtureDTO } from '@reelscore-sdk/models';

import {
  createMatchEvent,
  EXAMPLE_FIXTURE,
  readElementText,
  readElementTexts,
  renderComponent,
} from '@testing/client';

import { FixtureStore } from '../../../../../state';

import { MatchEventsComponent } from './events.component';

const fixtureState = signal<GetFixtureDTO | null>(null);

describe('MatchEventsComponent', () => {
  beforeEach(() => {
    fixtureState.set({ data: EXAMPLE_FIXTURE, highlights: [] });

    TestBed.configureTestingModule({
      imports: [MatchEventsComponent],
      providers: [
        { provide: FixtureStore, useValue: { fixture: fixtureState } },
      ],
    });
  });

  afterEach(() => jest.useRealTimers());

  it('sorts the timeline newest first without mutating input and inserts match boundaries', () => {
    const events = [
      createMatchEvent(),
      createMatchEvent({
        time: { elapsed: 60, extra: 2 },
        player: { id: 11, name: 'Later' },
      }),
    ];
    const componentFixture = renderComponent(MatchEventsComponent, {
      data: events,
    });

    expect(
      readElementTexts(componentFixture.nativeElement, '.spacer-row')
    ).toEqual(['ENDE', 'HALBZEIT', 'ANPFIFF']);
    expect(
      readElementText(
        componentFixture.nativeElement.querySelector('.event-row')
      )
    ).toContain('Later');
    expect(readElementText(componentFixture.nativeElement)).toContain("62'");
    expect(events.map((event) => event.time.elapsed)).toEqual([20, 60]);
    expect(
      componentFixture.nativeElement.querySelector('.event-row-new')
    ).toBeNull();
  });

  it('recomputes team placement and the finished marker when fixture data arrives or changes', () => {
    fixtureState.set(null);

    const componentFixture = renderComponent(MatchEventsComponent, {
      data: [createMatchEvent()],
    });

    expect(
      componentFixture.nativeElement.querySelector('rs-match-event')
    ).toBeNull();

    fixtureState.set({ data: EXAMPLE_FIXTURE, highlights: [] });
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('.home rs-match-event')
    ).not.toBeNull();

    fixtureState.set({
      data: {
        ...EXAMPLE_FIXTURE,
        fixture: {
          ...EXAMPLE_FIXTURE.fixture,
          status: { ...EXAMPLE_FIXTURE.fixture.status, short: '2H' },
        },
        teams: {
          home: EXAMPLE_FIXTURE.teams.away,
          away: EXAMPLE_FIXTURE.teams.home,
        },
      },
      highlights: [],
    });
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('.away rs-match-event')
    ).not.toBeNull();
    expect(readElementText(componentFixture.nativeElement)).not.toContain(
      'ENDE'
    );
  });

  it('animates only newly received events, restarts the timeout and cancels it on destruction', () => {
    jest.useFakeTimers();

    const componentFixture = renderComponent(MatchEventsComponent, {
      data: [],
    });
    const initialEvent = createMatchEvent();

    componentFixture.componentRef.setInput('data', [initialEvent]);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('.event-row-new')
    ).toBeNull();

    const secondHalfEvent = createMatchEvent({
      time: { elapsed: 60, extra: null },
    });

    componentFixture.componentRef.setInput('data', [
      initialEvent,
      secondHalfEvent,
    ]);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelectorAll('.event-row-new')
    ).toHaveLength(1);

    jest.advanceTimersByTime(600);

    const lateMatchEvent = createMatchEvent({
      time: { elapsed: 80, extra: null },
    });

    componentFixture.componentRef.setInput('data', [
      initialEvent,
      secondHalfEvent,
      lateMatchEvent,
    ]);
    componentFixture.detectChanges();
    jest.advanceTimersByTime(100);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelectorAll('.event-row-new')
    ).toHaveLength(1);

    jest.advanceTimersByTime(600);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('.event-row-new')
    ).toBeNull();

    componentFixture.componentRef.setInput('data', [
      createMatchEvent({ time: { elapsed: 90, extra: null } }),
    ]);
    componentFixture.detectChanges();
    componentFixture.destroy();

    expect(jest.getTimerCount()).toBe(0);
  });

  it('renders shootout scores independently of the regular score and displays missed penalties', () => {
    const events = [
      createMatchEvent(),
      createMatchEvent({ detail: 'Penalty', time: { elapsed: 120, extra: 1 } }),
      createMatchEvent({
        detail: 'Missed Penalty',
        time: { elapsed: 120, extra: 2 },
        team: { ...EXAMPLE_FIXTURE.teams.away, goals: 0 },
      }),
      createMatchEvent({
        detail: 'Penalty',
        time: { elapsed: 120, extra: 3 },
        team: { ...EXAMPLE_FIXTURE.teams.away, goals: 1 },
      }),
    ];
    const componentFixture = renderComponent(MatchEventsComponent, {
      data: events,
    });

    expect(readElementTexts(componentFixture.nativeElement, '.result')).toEqual(
      ['1 - 1', '1 - 0', '1 - 0']
    );
    expect(
      readElementText(componentFixture.nativeElement.querySelector('mat-icon'))
    ).toBe('close');
    expect(readElementText(componentFixture.nativeElement)).toContain(
      'ELFMETERSCHIESSEN'
    );
    expect(readElementTexts(componentFixture.nativeElement, '.bottom')).toEqual(
      []
    );
  });

  it('separates extra time, the penalty shootout and the first half', () => {
    fixtureState.set({
      data: {
        ...EXAMPLE_FIXTURE,
        score: {
          ...EXAMPLE_FIXTURE.score,
          extratime: { home: null, away: null },
          penalty: { home: 5, away: 4 },
        },
      },
      highlights: [],
    });

    const componentFixture = renderComponent(MatchEventsComponent, {
      data: [
        createMatchEvent({ time: { elapsed: 20, extra: null } }),
        createMatchEvent({ time: { elapsed: 90, extra: 3 } }),
        createMatchEvent({ time: { elapsed: 91, extra: null } }),
        createMatchEvent({ time: { elapsed: 105, extra: 2 } }),
        createMatchEvent({
          detail: 'Penalty',
          time: { elapsed: 120, extra: 1 },
        }),
      ],
    });

    expect(
      readElementTexts(componentFixture.nativeElement, '.spacer-row')
    ).toEqual([
      'ENDE',
      'ELFMETERSCHIESSEN',
      'VERLÄNGERUNG',
      'HALBZEIT',
      'ANPFIFF',
    ]);
  });

  it.each([
    ['subst', 'Substitution', 'sync', ''],
    ['Var', 'Goal cancelled', 'live_tv', ''],
  ] as const)(
    'renders %s / %s with its timeline icon',
    (type, detail, expectedIconName, expectedIconClass) => {
      const componentFixture = renderComponent(MatchEventsComponent, {
        data: [createMatchEvent({ type, detail })],
      });
      const timelineIcon =
        componentFixture.nativeElement.querySelector('mat-icon');

      expect(readElementText(timelineIcon)).toBe(expectedIconName);

      if (expectedIconClass) {
        expect(timelineIcon.classList.contains(expectedIconClass)).toBe(true);
      }
    }
  );

  it.each([
    ['Yellow Card', 'yellow-card', 'Gelbe Karte'],
    ['Red Card', 'red-card', 'Rote Karte'],
  ] as const)('renders a CSS %s card icon', (detail, className, label) => {
    const componentFixture = renderComponent(MatchEventsComponent, {
      data: [createMatchEvent({ type: 'Card', detail })],
    });
    const cardIcon = componentFixture.nativeElement.querySelector(
      `.card-icon.${className}`
    );

    expect(cardIcon).not.toBeNull();
    expect(cardIcon.getAttribute('aria-label')).toBe(label);
    expect(componentFixture.nativeElement.querySelector('mat-icon')).toBeNull();
  });

  it('rotates away team card icons to the right', () => {
    const awayCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
      team: { ...EXAMPLE_FIXTURE.teams.away, goals: 0 },
    });
    const componentFixture = renderComponent(MatchEventsComponent, {
      data: [awayCard],
    });

    expect(
      componentFixture.nativeElement.querySelector(
        '.event-icon.away-card .card-icon'
      )
    ).not.toBeNull();
  });

  it('renders a second yellow card as one yellow-red card event', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
    });
    const redCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
    });

    const componentFixture = renderComponent(MatchEventsComponent, {
      data: [yellowCard],
    });

    expect(
      componentFixture.nativeElement.querySelector('.card-stack')
    ).toBeNull();

    componentFixture.componentRef.setInput('data', [yellowCard, redCard]);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelectorAll('.event-row')
    ).toHaveLength(1);
    expect(
      componentFixture.nativeElement.querySelector('.card-stack')
    ).not.toBeNull();
    expect(
      componentFixture.nativeElement.querySelector('.event-row-new')
    ).not.toBeNull();
    expect(
      componentFixture.nativeElement
        .querySelector('.card-stack')
        ?.getAttribute('aria-label')
    ).toBe('Gelb-Rote Karte');
    expect(
      componentFixture.nativeElement.querySelector('.card-stack .yellow-card')
    ).not.toBeNull();
    expect(
      componentFixture.nativeElement.querySelector('.card-stack .red-card')
    ).not.toBeNull();
  });
});
