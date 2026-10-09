import { TestBed } from '@angular/core/testing';

import type {
  EvaluationDTO,
  ExtendedFixtureDTO,
  LatestFixturesDTO,
} from '@reelscore-sdk/models';

import { readElementText, renderComponent } from '@testing/client';

import { MatchEvaluationsComponent } from './evaluations.component';

describe('MatchEvaluationsComponent', () => {
  const fixture = {
    fixture: { id: 1, timestamp: 1700000000 },
    teams: {
      home: { id: 1, name: 'Heimteam', logo: 'home.png' },
      away: { id: 2, name: 'Auswärtsteam', logo: 'away.png' },
    },
  } as unknown as ExtendedFixtureDTO;

  const latestFixtures = {
    home: [
      { fixture: { timestamp: 1699000000 } },
      { fixture: { timestamp: 1698000000 } },
      { fixture: { timestamp: 1697000000 } },
      { fixture: { timestamp: 1696000000 } },
      { fixture: { timestamp: 1695000000 } },
    ],
    away: [],
  } as unknown as LatestFixturesDTO;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatchEvaluationsComponent] });
  });

  it('shows loading, error and empty states and recovers to data without mutating input', () => {
    const componentFixture = renderComponent(MatchEvaluationsComponent, {
      evaluations: null,
      fixture,
      latestFixtures,
      isLoading: true,
      error: 'failed',
    });

    expect(
      componentFixture.nativeElement.querySelectorAll('.rs-skeleton')
    ).toHaveLength(22);
    expect(
      componentFixture.nativeElement
        .querySelector('.team-grid')
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
          results: ['WIN', 'DRAW', 'LOSS', 'NO_RESULT_AVAILABLE', 'WIN'],
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
    componentFixture.componentRef.setInput('latestFixtures', latestFixtures);
    componentFixture.componentRef.setInput('error', 'stale error');
    componentFixture.detectChanges();

    const homeResultItems = componentFixture.nativeElement.querySelectorAll(
      '.team-card:first-child .form-section:first-of-type .evaluation-item'
    );
    const homePerformanceItems =
      componentFixture.nativeElement.querySelectorAll(
        '.team-card:first-child .form-section:last-of-type .evaluation-item'
      );

    expect(homeResultItems).toHaveLength(5);
    expect(homePerformanceItems).toHaveLength(5);
    expect(homeResultItems[1].classList).toContain('no-result-available');
    expect(homeResultItems[4].classList).toContain('win');
    expect(
      componentFixture.nativeElement.querySelectorAll('.current-match')
    ).toHaveLength(0);
    const homeResultDates = componentFixture.nativeElement.querySelectorAll(
      '.team-card:first-child .form-section:first-of-type time'
    );
    expect(homeResultDates[0].textContent).toBe('18.09.');
    expect(homeResultDates[4].textContent).toBe('03.11.');
    expect(
      componentFixture.nativeElement.querySelector('.team-card').textContent
    ).toContain('Heimteam');
    expect(
      componentFixture.nativeElement
        .querySelectorAll('.team-card')[1]
        .classList.contains('team-card-away')
    ).toBe(true);
    expect(
      componentFixture.nativeElement.querySelectorAll('.team-header-away')
    ).toHaveLength(1);
    const teamLogos = componentFixture.nativeElement.querySelectorAll(
      '.team-card rs-responsive-image img'
    );
    expect(teamLogos).toHaveLength(2);
    expect(teamLogos[0].getAttribute('src')).toContain('/48x48/');
    expect(teamLogos[0].getAttribute('srcset')).toContain('3x');
    expect(teamLogos[0].getAttribute('width')).toBe('24');
    expect(
      componentFixture.nativeElement.querySelectorAll('.info-button')
    ).toHaveLength(2);
    expect(
      componentFixture.nativeElement
        .querySelector('.info-button')
        .getAttribute('aria-label')
    ).toContain('Performance-Bewertung');
    expect(evaluations.teams.home.results).toEqual([
      'WIN',
      'DRAW',
      'LOSS',
      'NO_RESULT_AVAILABLE',
      'WIN',
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
