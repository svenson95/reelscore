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
        playersWithStreak: { home: ['Striker', 'Second'], away: [] },
        homeOrAwayStrong: { home: true, away: false },
      },
    });

    expect(readElementTexts(componentFixture.nativeElement, '.player')).toEqual(
      ['Striker', 'Second']
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
      playersWithStreak: { home: [], away: ['Away'] },
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
