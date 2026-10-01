import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BreakpointObserverService, ThemeService } from '@app/shared';

import {
  readElementText,
  renderComponent,
} from '../../../../../../../../testing/match-components.testing';
import { EXAMPLE_STANDINGS } from '../../../../../../../../testing/standings.mock';

import { MatchFixtureStandingsComponent } from './standings.component';

const isMobile = signal(false);

describe('MatchFixtureStandingsComponent', () => {
  beforeEach(() => {
    isMobile.set(false);

    TestBed.configureTestingModule({
      imports: [MatchFixtureStandingsComponent],
      providers: [
        provideRouter([]),
        { provide: ThemeService, useValue: { isSystemDark: signal(false) } },
        {
          provide: BreakpointObserverService,
          useValue: { isMobile: isMobile },
        },
      ],
    });
  });

  it('renders mobile and desktop loading tables with competition labels', () => {
    const componentFixture = renderComponent(MatchFixtureStandingsComponent, {
      standings: null,
      isLoading: true,
      competitionName: 'League',
    });

    expect(
      componentFixture.nativeElement.querySelectorAll('.standings-skeleton')
    ).toHaveLength(3);
    expect(readElementText(componentFixture.nativeElement)).toContain('League');
    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Heimtabelle'
    );
    expect(
      componentFixture.nativeElement.querySelectorAll('.rs-skeleton')
    ).toHaveLength(32);

    isMobile.set(true);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelectorAll('.rs-skeleton')
    ).toHaveLength(28);

    componentFixture.componentRef.setInput('groupCompetition', true);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelectorAll('.standings-skeleton')
    ).toHaveLength(1);
  });

  it('renders standings over stale errors and exposes failure or empty states when data is missing', () => {
    const componentFixture = renderComponent(MatchFixtureStandingsComponent, {
      standings: EXAMPLE_STANDINGS,
      isLoading: false,
      error: 'stale',
    });

    expect(
      componentFixture.nativeElement.querySelectorAll('rs-standings-table')
    ).toHaveLength(EXAMPLE_STANDINGS.league.standings.length);
    expect(componentFixture.nativeElement.querySelector('.no-data')).toBeNull();

    componentFixture.componentRef.setInput('standings', null);
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Fehler beim Laden der Tabellen'
    );
    expect(
      componentFixture.nativeElement.querySelector('[role="status"]')
    ).not.toBeNull();

    componentFixture.componentRef.setInput('error', null);
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Keine Tabellen verfügbar'
    );
  });

  it('renders each group separately for a group competition', () => {
    const standingRanks = EXAMPLE_STANDINGS.league.standings[0];
    const componentFixture = renderComponent(MatchFixtureStandingsComponent, {
      standings: {
        ...EXAMPLE_STANDINGS,
        league: {
          ...EXAMPLE_STANDINGS.league,
          id: 2,
          season: 2023,
          standings: [standingRanks, standingRanks],
        },
      },
      isLoading: false,
    });

    expect(
      componentFixture.nativeElement.querySelectorAll('rs-standings-table')
    ).toHaveLength(2);
    expect(readElementText(componentFixture.nativeElement)).not.toContain(
      'Heimtabelle'
    );
  });
});
