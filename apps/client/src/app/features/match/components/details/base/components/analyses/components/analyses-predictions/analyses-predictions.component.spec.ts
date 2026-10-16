import { TestBed } from '@angular/core/testing';

import {
  readElementText,
  readElementTexts,
  renderComponent,
} from '@testing/client';

import { AnalysesPredictionsComponent } from './analyses-predictions.component';

describe('AnalysesPredictionsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AnalysesPredictionsComponent] });
  });

  it('renders streak players and distinguishes true, false and unavailable strength', () => {
    const componentFixture = renderComponent(AnalysesPredictionsComponent, {
      analyses: {
        playersWithStreak: {
          home: [
            { name: 'Striker', goalsByMatch: [0, 1, 2] },
            { name: 'Second', goalsByMatch: [0, 0, 1] },
          ],
          away: [],
        },
        homeOrAwayStrong: { home: true, away: false },
      },
    });

    expect(readElementTexts(componentFixture.nativeElement, '.player')).toEqual(
      ['Striker', 'Second']
    );
    expect(
      readElementTexts(componentFixture.nativeElement, '.goal-count')
    ).toEqual(['0', '1', '2', '0', '0', '1']);
    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Torjäger'
    );
    expect(readElementText(componentFixture.nativeElement)).toContain(
      '3+ Spiele in Folge (letzte 5)'
    );
    expect(
      readElementText(
        componentFixture.nativeElement.querySelector('.playersWithStreak .away')
      )
    ).toBe('-');
    expect(
      readElementText(
        componentFixture.nativeElement.querySelector(
          '.strongAtHomeOrAway .home'
        )
      )
    ).toBe('Ja');
    expect(
      readElementText(
        componentFixture.nativeElement.querySelector(
          '.strongAtHomeOrAway .away'
        )
      )
    ).toBe('Nein');

    componentFixture.componentRef.setInput('analyses', {
      playersWithStreak: {
        home: [],
        away: [{ name: 'Away', goalsByMatch: [1, 2, 1] }],
      },
      homeOrAwayStrong: null,
    });
    componentFixture.detectChanges();

    expect(
      readElementText(
        componentFixture.nativeElement.querySelector('.playersWithStreak .home')
      )
    ).toBe('-');
    expect(
      readElementText(
        componentFixture.nativeElement.querySelector(
          '.strongAtHomeOrAway .home'
        )
      )
    ).toBe('-');
    expect(
      readElementText(
        componentFixture.nativeElement.querySelector(
          '.strongAtHomeOrAway .away'
        )
      )
    ).toBe('-');
  });
});
