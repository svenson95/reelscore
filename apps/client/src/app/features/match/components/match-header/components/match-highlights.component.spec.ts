import { TestBed } from '@angular/core/testing';

import {
  createMatchEvent,
  EXAMPLE_FIXTURE,
  readElementText,
  readElementTexts,
  renderComponent,
} from '@testing/client';

import { filterFixtureHighlights } from '@lib/shared';

import { MatchHighlightsComponent } from './match-highlights.component';

describe('MatchHighlightsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatchHighlightsComponent] });
  });

  it('shows chronological goals, halftime and independent shootout scores without counting misses or cards', () => {
    const events = [
      createMatchEvent(),
      createMatchEvent({
        time: { elapsed: 60, extra: null },
        team: { ...EXAMPLE_FIXTURE.teams.away, goals: 1 },
      }),
      createMatchEvent({
        type: 'Card',
        detail: 'Red Card',
        time: { elapsed: 70, extra: null },
      }),
      createMatchEvent({ detail: 'Penalty', time: { elapsed: 120, extra: 1 } }),
      createMatchEvent({
        detail: 'Missed Penalty',
        time: { elapsed: 120, extra: 2 },
        team: { ...EXAMPLE_FIXTURE.teams.away, goals: 1 },
      }),
      createMatchEvent({
        detail: 'Penalty',
        time: { elapsed: 120, extra: 3 },
        team: { ...EXAMPLE_FIXTURE.teams.away, goals: 1 },
      }),
    ];
    const componentFixture = renderComponent(MatchHighlightsComponent, {
      data: {
        ...EXAMPLE_FIXTURE,
        score: { ...EXAMPLE_FIXTURE.score, halftime: { home: 1, away: 0 } },
      },
      highlights: events,
    });

    expect(
      readElementTexts(componentFixture.nativeElement, '.result-column')
    ).toEqual(['1 - 0', '1 - 1', '', '1 - 0', '×', '1 - 1']);
    expect(
      readElementTexts(componentFixture.nativeElement, '.highlight-spacer')
    ).toEqual(['Halbzeit', 'Elfmeterschießen']);
    expect(
      componentFixture.nativeElement.querySelectorAll('.red-card')
    ).toHaveLength(1);
    expect(
      readElementText(
        componentFixture.nativeElement
          .querySelectorAll('.event-row')[1]
          .querySelector('.team-column:last-child')
      )
    ).toContain("60'");
    expect(events[0].result).toEqual({ home: 1, away: 0 });
  });

  it('keeps first-half stoppage-time events together and clears removed highlights', () => {
    const componentFixture = renderComponent(MatchHighlightsComponent, {
      data: {
        ...EXAMPLE_FIXTURE,
        score: { ...EXAMPLE_FIXTURE.score, halftime: { home: 2, away: 0 } },
      },
      highlights: [
        createMatchEvent(),
        createMatchEvent({ time: { elapsed: 45, extra: 4 } }),
      ],
    });

    expect(
      componentFixture.nativeElement.querySelector('.highlight-spacer')
    ).toBeNull();
    expect(readElementText(componentFixture.nativeElement)).toContain("49'");

    componentFixture.componentRef.setInput('highlights', []);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('.event-row')
    ).toBeNull();
  });

  it('separates extra-time and shootout highlights', () => {
    const componentFixture = renderComponent(MatchHighlightsComponent, {
      data: {
        ...EXAMPLE_FIXTURE,
        score: {
          ...EXAMPLE_FIXTURE.score,
          extratime: { home: null, away: null },
          penalty: { home: 5, away: 4 },
        },
      },
      highlights: [
        createMatchEvent({ time: { elapsed: 90, extra: 2 } }),
        createMatchEvent({ time: { elapsed: 91, extra: null } }),
        createMatchEvent({ time: { elapsed: 105, extra: 1 } }),
        createMatchEvent({
          detail: 'Penalty',
          time: { elapsed: 120, extra: 1 },
        }),
      ],
    });

    expect(
      readElementTexts(
        componentFixture.nativeElement,
        '.highlight-spacer-label'
      )
    ).toEqual(['Verlängerung', 'Elfmeterschießen']);
  });

  it('keeps same-minute shootout kicks in provider order', () => {
    const componentFixture = renderComponent(MatchHighlightsComponent, {
      data: {
        ...EXAMPLE_FIXTURE,
        score: {
          ...EXAMPLE_FIXTURE.score,
          penalty: { home: 5, away: 4 },
        },
      },
      highlights: filterFixtureHighlights([
        createMatchEvent({
          time: { elapsed: 120, extra: null },
          player: { id: 1, name: 'Hakimi' },
        }),
        createMatchEvent({
          time: { elapsed: 120, extra: null },
          player: { id: 2, name: 'Martinelli' },
        }),
      ]),
    });

    expect(
      readElementTexts(componentFixture.nativeElement, '.event-player')
    ).toEqual(['Hakimi', 'Martinelli']);
  });
});
