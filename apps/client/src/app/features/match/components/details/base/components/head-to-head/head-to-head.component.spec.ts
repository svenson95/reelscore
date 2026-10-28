import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

import { EXAMPLE_FIXTURE } from '@testing/client';

import { MatchHeadToHeadComponent } from './head-to-head.component';

describe(MatchHeadToHeadComponent.name, () => {
  const createFixture = (
    overrides: Partial<ExtendedFixtureDTO['score']['fulltime']> = {}
  ): ExtendedFixtureDTO =>
    ({
      ...EXAMPLE_FIXTURE,
      fixture: {
        ...EXAMPLE_FIXTURE.fixture,
        id: 42,
        status: { ...EXAMPLE_FIXTURE.fixture.status, short: 'FT' },
      },
      teams: {
        ...EXAMPLE_FIXTURE.teams,
        home: { ...EXAMPLE_FIXTURE.teams.home, winner: false },
        away: { ...EXAMPLE_FIXTURE.teams.away, winner: true },
      },
      goals: { home: 1, away: 2 },
      score: {
        ...EXAMPLE_FIXTURE.score,
        fulltime: { home: 1, away: 2, ...overrides },
      },
    } as ExtendedFixtureDTO);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchHeadToHeadComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows previous meeting scores, competition and date', () => {
    const view = TestBed.createComponent(MatchHeadToHeadComponent);
    view.componentRef.setInput('fixture', createFixture());
    view.componentRef.setInput('fixtures', [createFixture()]);
    view.detectChanges();

    expect(view.nativeElement.textContent).toContain('Letzte Begegnungen');
    expect(view.nativeElement.textContent).toContain('1');
    expect(view.nativeElement.textContent).toContain('2');
    expect(view.nativeElement.textContent).toContain(
      EXAMPLE_FIXTURE.league.name
    );
    expect(
      view.nativeElement.querySelectorAll('rs-match-fixtures-table')
    ).toHaveLength(1);
    expect(
      view.nativeElement.querySelector('rs-match-fixtures-table a')
    ).not.toBeNull();
    expect(
      view.nativeElement.querySelector('rs-match-fixtures-table .team-header')
    ).toBeNull();
  });

  it('shows an empty state when no completed meetings are available', () => {
    const view = TestBed.createComponent(MatchHeadToHeadComponent);
    view.componentRef.setInput('fixtures', []);
    view.detectChanges();

    expect(view.nativeElement.textContent).toContain(
      'Keine letzten Begegnungen gefunden'
    );
  });
});
