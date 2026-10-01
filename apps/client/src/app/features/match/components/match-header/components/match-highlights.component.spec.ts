import { TestBed } from '@angular/core/testing';

import {
  renderComponent,
  readElementText,
  createMatchEvent,
  readElementTexts,
} from '../../../../../../testing/match-components.testing';
import { EXAMPLE_FIXTURE } from '../../../../../../testing/fixtures.mock';

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
});
