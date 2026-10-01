import { TestBed } from '@angular/core/testing';

import {
  renderComponent,
  readElementText,
  createFixtureAnalysis,
} from '../../../../../../../../../../testing/match-components.testing';
import { EXAMPLE_FIXTURE } from '../../../../../../../../../../testing/fixtures.mock';

import { AnalysesLastFixturesComponent } from './last-fixtures.component';

describe('AnalysesLastFixturesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnalysesLastFixturesComponent],
    });
  });

  it('filters fixtures without analyses, merges team analyses by minute and preserves the source data', () => {
    const fixtureWithAnalyses = {
      ...EXAMPLE_FIXTURE,
      evaluations: {
        home: {
          performance: 'HIGH',
          analyses: [createFixtureAnalysis({ minute: 80 })],
        },
        away: {
          performance: 'LOW',
          analyses: [createFixtureAnalysis({ minute: 10, level: 'UNLUCKY' })],
        },
      },
    };
    const originalFixtureJson = JSON.stringify(fixtureWithAnalyses);
    const componentFixture = renderComponent(AnalysesLastFixturesComponent, {
      teams: EXAMPLE_FIXTURE.teams,
      fixtures: { home: [EXAMPLE_FIXTURE, fixtureWithAnalyses], away: [] },
    });
    const fixturesWithEvaluations =
      componentFixture.componentInstance.fixturesWithEvaluations();

    expect(fixturesWithEvaluations.home).toHaveLength(1);
    expect(
      fixturesWithEvaluations.home[0].flatEvaluations.map((fixtureAnalysis) => [
        fixtureAnalysis.minute,
        fixtureAnalysis.team,
      ])
    ).toEqual([
      [10, 'away'],
      [80, 'home'],
    ]);
    expect(JSON.stringify(fixtureWithAnalyses)).toBe(originalFixtureJson);
    expect(
      componentFixture.nativeElement.querySelectorAll(
        'rs-match-fixture-analyses-evaluations'
      )
    ).toHaveLength(1);
    expect(
      readElementText(componentFixture.nativeElement.querySelector('.away'))
    ).toContain('Keine Spiele gefunden');

    componentFixture.componentRef.setInput('fixtures', { home: [], away: [] });
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelectorAll('.no-data')
    ).toHaveLength(2);
  });

  it('retains analyses without a minute and fixtures with analyses from only one team', () => {
    const componentFixture = renderComponent(AnalysesLastFixturesComponent, {
      teams: EXAMPLE_FIXTURE.teams,
      fixtures: {
        home: [],
        away: [
          {
            ...EXAMPLE_FIXTURE,
            evaluations: {
              home: { performance: 'MIDDLE', analyses: [] },
              away: {
                performance: 'HIGH',
                analyses: [createFixtureAnalysis({ minute: null })],
              },
            },
          },
        ],
      },
    });

    expect(
      componentFixture.componentInstance.fixturesWithEvaluations().away[0]
        .flatEvaluations
    ).toEqual([{ ...createFixtureAnalysis({ minute: null }), team: 'away' }]);
  });
});
