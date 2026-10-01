import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { GetFixtureDTO } from '@lib/models';

import { EXAMPLE_FIXTURE } from '../../../../../../../../testing/fixtures.mock';
import {
  createMatchEvent,
  readElementText,
  readElementTexts,
  renderComponent,
} from '../../../../../../../../testing/match-components.testing';

import { FixtureStore } from '../../../../../stores';

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
  });

  it.each([
    ['Card', 'Yellow Card', 'style', 'yellow-card'],
    ['Card', 'Red Card', 'style', 'red-card'],
    ['subst', 'Substitution', 'sync', ''],
    ['Var', 'Goal cancelled', 'visibility', ''],
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
});
