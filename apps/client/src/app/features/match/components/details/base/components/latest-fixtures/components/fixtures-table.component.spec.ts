import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  EXAMPLE_FIXTURE,
  readElementText,
  renderComponent,
} from '@testing/client';

import { MatchFixturesTableComponent } from './fixtures-table.component';

describe('MatchFixturesTableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchFixturesTableComponent],
      providers: [provideRouter([])],
    });
  });

  it('renders match links, marks the related team and distinguishes wins from losses', () => {
    const fixtureWithPerformances = {
      ...EXAMPLE_FIXTURE,
      evaluations: {
        home: { performance: 'LOW' as const, analyses: [] },
        away: { performance: 'HIGH' as const, analyses: [] },
      },
    };

    const componentFixture = renderComponent(MatchFixturesTableComponent, {
      fixtures: [fixtureWithPerformances],
      team: EXAMPLE_FIXTURE.teams.home,
      side: 'home',
    });
    const link = componentFixture.nativeElement.querySelector('a');

    expect(link.getAttribute('href')).toContain(
      String(EXAMPLE_FIXTURE.fixture.id)
    );
    expect(link.classList.contains('is-winner')).toBe(true);
    expect(
      componentFixture.nativeElement.querySelector('.competition').textContent
    ).toContain(EXAMPLE_FIXTURE.league.name);
    expect(
      componentFixture.nativeElement.querySelectorAll('.evaluation-value')
    ).toHaveLength(2);
    expect(
      componentFixture.nativeElement.querySelector('.low').textContent
    ).toContain('S');
    expect(
      componentFixture.nativeElement.querySelector('.home .is-related')
    ).not.toBeNull();

    componentFixture.componentRef.setInput('team', EXAMPLE_FIXTURE.teams.away);
    componentFixture.componentRef.setInput('side', 'away');
    componentFixture.detectChanges();

    expect(link.classList.contains('is-loser')).toBe(true);
    expect(link.classList.contains('is-winner')).toBe(false);
    expect(
      componentFixture.nativeElement.querySelector('.high').textContent
    ).toContain('G');
    expect(
      componentFixture.nativeElement.querySelector('.home .is-related')
    ).toBeNull();

    componentFixture.componentRef.setInput('fixtures', [EXAMPLE_FIXTURE]);
    componentFixture.detectChanges();

    const missingValues = componentFixture.nativeElement.querySelectorAll(
      '.evaluation-value.unknown'
    );
    expect(missingValues).toHaveLength(2);
    expect(
      Array.from(missingValues, (element: Element) =>
        element.textContent?.trim()
      )
    ).toEqual(['-', '-']);

    componentFixture.componentRef.setInput('fixtures', []);
    componentFixture.detectChanges();

    expect(componentFixture.nativeElement.querySelector('a')).toBeNull();
    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Keine Spiele gefunden'
    );
  });
});
