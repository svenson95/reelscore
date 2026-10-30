import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { SearchResult, SearchResultGroup } from '@reelscore-sdk/models';

import { EXAMPLE_FIXTURE } from '@testing/client';

import { TeamNamePipe, ThemeService } from '@app/shared';

import { SearchResultsComponent } from './search-results.component';

describe('SearchResultsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        TeamNamePipe,
        {
          provide: ThemeService,
          useValue: { isSystemDark: signal(false) },
        },
      ],
    });
  });

  it('shows the competition, round and date for fixture results', () => {
    const fixtureResult = {
      id: String(EXAMPLE_FIXTURE.fixture.id),
      type: 'fixtures',
      data: EXAMPLE_FIXTURE,
    } satisfies SearchResult;
    const competitionResult = {
      id: String(EXAMPLE_FIXTURE.league.id),
      type: 'competitions',
      data: { league: EXAMPLE_FIXTURE.league },
    } satisfies SearchResult;
    const teamResult = {
      id: String(EXAMPLE_FIXTURE.teams.home.id),
      type: 'teams',
      data: { team: EXAMPLE_FIXTURE.teams.home },
    } satisfies SearchResult;
    const groups: SearchResultGroup[] = [
      {
        type: 'competitions',
        label: 'Wettbewerbe',
        results: [competitionResult],
      },
      {
        type: 'teams',
        label: 'Teams',
        results: [teamResult],
      },
      {
        type: 'fixtures',
        label: 'Spiele',
        results: [fixtureResult],
      },
    ];

    const componentFixture = TestBed.createComponent(SearchResultsComponent);
    componentFixture.componentRef.setInput('groups', groups);
    componentFixture.detectChanges();

    const competitionAndRound = componentFixture.nativeElement.querySelectorAll(
      '.result-competition-round'
    )[2];

    expect(competitionAndRound.textContent.replace(/\s+/g, ' ').trim()).toBe(
      'UEFA Champions League · Finale'
    );
    expect(
      componentFixture.nativeElement.querySelector('.result-date').textContent
    ).toContain('30.05');
    expect(componentFixture.nativeElement.textContent).not.toContain('2025/26');
    expect(componentFixture.nativeElement.textContent).toContain(
      'Paris Saint-Germain'
    );
  });
});
