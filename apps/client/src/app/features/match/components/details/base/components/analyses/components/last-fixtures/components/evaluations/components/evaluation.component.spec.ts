import { TestBed } from '@angular/core/testing';

import {
  createFixtureAnalysis,
  readElementText,
  renderComponent,
} from '@testing/client';

import { AnalysesEvaluationComponent } from './evaluation.component';

describe('AnalysesEvaluationComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AnalysesEvaluationComponent] });
  });

  it('renders the analysis values and clears absent fields on updates', () => {
    const componentFixture = renderComponent(AnalysesEvaluationComponent, {
      analyzedElement: createFixtureAnalysis(),
    });

    expect(readElementText(componentFixture.nativeElement)).toBe(
      "20' ⚽ Glück Comment Player"
    );
    expect(
      componentFixture.nativeElement.querySelector('.is-lucky')
    ).not.toBeNull();

    componentFixture.componentRef.setInput(
      'analyzedElement',
      createFixtureAnalysis({
        minute: null,
        type: 'GOAL',
        level: 'UNLUCKY',
        comments: '',
        player: null,
      })
    );
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toBe('⚽ Pech');
    expect(
      componentFixture.nativeElement.querySelector('.is-lucky')
    ).toBeNull();
    expect(componentFixture.nativeElement.querySelector('.minute')).toBeNull();
  });

  it.each([
    ['NO_GOAL', 'KEIN TOR'],
    ['NO_FOUL', 'KEIN FOUL'],
    ['LAST_MINUTE_GOAL', 'LAST-MINUTE ⚽'],
    ['PENALTY', 'ELFMETER ⚽'],
    ['RED_CARD', '🟥 KARTE'],
    ['NO_RED_CARD', 'KEINE 🟥 KARTE'],
    ['KEY_PLAYER_INJURY', 'STAMMSPIELER VERLETZT'],
    [
      'KEY_PLAYER_YELLOW_CARD_SUSPENSION',
      'STAMMSPIELER NÄCHSTES SPIEL 🟨 GESPERRT',
    ],
  ] as const)('labels %s and unlucky analyses', (type, label) => {
    const componentFixture = renderComponent(AnalysesEvaluationComponent, {
      analyzedElement: createFixtureAnalysis({
        type,
        level: 'UNLUCKY',
        minute: 0,
      }),
    });

    expect(
      readElementText(componentFixture.nativeElement.querySelector('.type'))
    ).toBe(label);
    expect(
      readElementText(componentFixture.nativeElement.querySelector('.minute'))
    ).toBe("0'");
    expect(
      readElementText(componentFixture.nativeElement.querySelector('.level'))
    ).toBe('Pech');
    expect(
      componentFixture.nativeElement.querySelector('.is-unlucky')
    ).not.toBeNull();
  });
});
