import { TestBed } from '@angular/core/testing';

import type { EvaluationDTO } from '@lib/models';

import {
  readElementText,
  readElementTexts,
  renderComponent,
} from '../../../../../../../../testing/match-components.testing';

import { MatchEvaluationsComponent } from './evaluations.component';

describe('MatchEvaluationsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatchEvaluationsComponent] });
  });

  it('shows loading, error and empty states and recovers to data without mutating input', () => {
    const componentFixture = renderComponent(MatchEvaluationsComponent, {
      evaluations: null,
      isLoading: true,
      error: 'failed',
    });

    expect(
      componentFixture.nativeElement.querySelectorAll('.rs-skeleton')
    ).toHaveLength(20);
    expect(
      componentFixture.nativeElement
        .querySelector('.content')
        .getAttribute('aria-busy')
    ).toBe('true');

    componentFixture.componentRef.setInput('isLoading', false);
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Fehler beim Laden'
    );

    componentFixture.componentRef.setInput('error', null);
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Keine Formdaten verfügbar'
    );

    const evaluations: EvaluationDTO = {
      fixture: 1,
      teams: {
        home: {
          results: ['WIN', 'DRAW', 'LOSS', 'NO_RESULT_AVAILABLE'],
          performances: [
            'HIGH',
            'MIDDLE',
            'LOW',
            'MATCH_NOT_STARTED',
            'MATCH_POSTPONED',
            'NO_STATISTICS_AVAILABLE',
          ],
        },
        away: { results: ['LOSS', 'WIN'], performances: ['LOW', 'HIGH'] },
      },
    };

    componentFixture.componentRef.setInput('evaluations', evaluations);
    componentFixture.componentRef.setInput('error', 'stale error');
    componentFixture.detectChanges();

    const homeResultLabels = readElementTexts(
      componentFixture.nativeElement,
      '.results .team:first-child span'
    );
    const awayResultLabels = readElementTexts(
      componentFixture.nativeElement,
      '.results .team:last-child span'
    );
    const homePerformanceLabels = readElementTexts(
      componentFixture.nativeElement,
      '.performance .team:first-child span'
    );

    expect(homeResultLabels).toEqual(['-', 'N', 'U', 'S']);
    expect(awayResultLabels).toEqual(['N', 'S']);
    expect(homePerformanceLabels).toEqual(['-', '-', '?', 'S', 'M', 'G']);
    expect(evaluations.teams.home.results).toEqual([
      'WIN',
      'DRAW',
      'LOSS',
      'NO_RESULT_AVAILABLE',
    ]);
    expect(componentFixture.nativeElement.querySelector('.no-data')).toBeNull();
  });

  it('treats empty arrays as unavailable form data', () => {
    const componentFixture = renderComponent(MatchEvaluationsComponent, {
      evaluations: {
        fixture: 1,
        teams: {
          home: { results: [], performances: [] },
          away: { results: [], performances: [] },
        },
      },
    });

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Keine Formdaten verfügbar'
    );
  });
});
