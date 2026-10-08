import { signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { StandingRanks } from '@reelscore-sdk/models';

import { EXAMPLE_STANDINGS } from '@testing/client';

import { BreakpointObserverService, ThemeService } from '../data-access';

import { StandingsTableComponent } from './standings-table.component';

describe('StandingsTableComponent', () => {
  const isMobile = signal(false);
  const isSystemDark = signal(false);
  let fixture: ComponentFixture<StandingsTableComponent>;

  beforeEach(async () => {
    isMobile.set(false);
    isSystemDark.set(false);
    await TestBed.configureTestingModule({
      imports: [StandingsTableComponent],
      providers: [
        provideRouter([]),
        { provide: BreakpointObserverService, useValue: { isMobile } },
        { provide: ThemeService, useValue: { isSystemDark } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StandingsTableComponent);
    fixture.componentRef.setInput('league', EXAMPLE_STANDINGS.league);
    fixture.componentRef.setInput(
      'ranks',
      EXAMPLE_STANDINGS.league.standings[0]
    );
  });

  it.each([
    ['League C, Group 1', 'Liga C Gruppe 1'],
    ['League C - Group 1', 'Liga C - Gruppe 1'],
    ['League C Group 1', 'Liga C Gruppe 1'],
    [' League C ,Group 1 ', 'Liga C Gruppe 1'],
    ['Group C', 'Gruppe C'],
    ['Ranking of third-placed teams', 'Rangliste der Drittplatzierten'],
    ['La Liga', 'La Liga'],
  ])('formats %s as %s', (group: string, expected: string) => {
    const ranks: StandingRanks[] = [
      { ...EXAMPLE_STANDINGS.league.standings[0][0], group },
    ];
    fixture.componentRef.setInput('ranks', ranks);

    expect(fixture.componentInstance.roundLabel()).toBe(expected);
  });

  it('falls back to the header or competition name for empty standings', () => {
    fixture.componentRef.setInput('ranks', []);

    expect(fixture.componentInstance.roundLabel()).toBe(
      EXAMPLE_STANDINGS.league.name
    );

    fixture.componentRef.setInput('header', 'Heimtabelle');

    expect(fixture.componentInstance.roundLabel()).toBe('Heimtabelle');
  });

  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const query = <T extends HTMLElement>(selector: string): T => {
    const result = element().querySelector<T>(selector);
    if (!result) {
      throw new Error(`Expected element matching ${selector}`);
    }
    return result;
  };
  const title = (): HTMLAnchorElement => query<HTMLAnchorElement>('th a');
  const cells = (): string[] =>
    Array.from(
      element().querySelectorAll('tbody tr:first-child td'),
      (cell) => cell.textContent?.trim() ?? ''
    );

  it('renders total, home and away statistics and updates when the header changes', () => {
    const rank: StandingRanks = {
      ...EXAMPLE_STANDINGS.league.standings[0][0],
      points: 17,
      goalsDiff: -4,
      all: {
        played: 12,
        win: 7,
        draw: 2,
        lose: 3,
        goals: { for: 25, against: 10 },
      },
      home: {
        played: 7,
        win: 5,
        draw: 1,
        lose: 1,
        goals: { for: 20, against: 3 },
      },
      away: {
        played: 5,
        win: 2,
        draw: 1,
        lose: 2,
        goals: { for: 5, against: 7 },
      },
    };
    fixture.componentRef.setInput('ranks', [rank]);
    fixture.detectChanges();

    // Total points and goal difference must preserve the supplied values.
    expect(cells().slice(2)).toEqual(['12', '7', '2', '3', '-4', '17']);

    fixture.componentRef.setInput('header', 'Heimtabelle');
    fixture.detectChanges();

    expect(cells().slice(2)).toEqual(['7', '5', '1', '1', '17', '16']);

    fixture.componentRef.setInput('header', 'Auswärtstabelle');
    fixture.detectChanges();

    expect(cells().slice(2)).toEqual(['5', '2', '1', '2', '-2', '7']);

    fixture.componentRef.setInput('header', 'Gesamttabelle');
    fixture.detectChanges();

    expect(cells().slice(2)).toEqual(['12', '7', '2', '3', '-4', '17']);
    expect(rank.points).toBe(17);
    expect(rank.goalsDiff).toBe(-4);
  });

  it('hides only the goal difference on mobile and restores it on desktop', () => {
    fixture.detectChanges();
    const desktopCells = cells();

    expect(element().querySelectorAll('th')).toHaveLength(8);

    isMobile.set(true);
    fixture.detectChanges();

    expect(element().querySelectorAll('th')).toHaveLength(7);
    expect(element().querySelector('.mat-column-goalDifference')).toBeNull();
    expect(cells()).toEqual(desktopCells.filter((_, index) => index !== 6));

    isMobile.set(false);
    fixture.detectChanges();

    expect(cells()).toEqual(desktopCells);
  });

  it('uses the competition name unless a non-empty header is supplied', () => {
    fixture.detectChanges();

    expect(title().textContent?.trim()).toBe('La Liga');

    fixture.componentRef.setInput('header', 'Heimtabelle');
    fixture.detectChanges();

    expect(title().textContent?.trim()).toBe('Heimtabelle');

    fixture.componentRef.setInput('header', '');
    fixture.detectChanges();

    expect(title().textContent?.trim()).toBe('La Liga');
  });

  it('prefers the group label for grouped competitions and reacts to new ranks', () => {
    fixture.componentRef.setInput('league', {
      ...EXAMPLE_STANDINGS.league,
      id: 5,
    });
    fixture.componentRef.setInput('header', 'Heimtabelle');
    fixture.componentRef.setInput('ranks', [
      {
        ...EXAMPLE_STANDINGS.league.standings[0][0],
        group: 'League C - Group 1',
      },
    ]);
    fixture.detectChanges();

    expect(title().textContent?.trim()).toBe('Liga C - Gruppe 1');

    fixture.componentRef.setInput('ranks', [
      {
        ...EXAMPLE_STANDINGS.league.standings[0][0],
        group: 'Group D',
        points: 10,
      },
    ]);
    fixture.detectChanges();

    expect(title().textContent?.trim()).toBe('Gruppe D');

    fixture.componentRef.setInput('header', undefined);
    fixture.detectChanges();

    expect(cells().at(-1)).toBe('10');
  });

  it('renders empty standings and falls back when a group is missing', () => {
    fixture.componentRef.setInput('league', {
      ...EXAMPLE_STANDINGS.league,
      id: 5,
    });
    fixture.componentRef.setInput('ranks', [
      {
        ...EXAMPLE_STANDINGS.league.standings[0][0],
        group: '',
      },
    ]);
    fixture.detectChanges();

    expect(title().textContent?.trim()).toBe('La Liga');

    fixture.componentRef.setInput('ranks', []);
    fixture.detectChanges();

    expect(element().querySelectorAll('tbody tr')).toHaveLength(0);
    expect(title().textContent?.trim()).toBe('La Liga');
  });

  it('links known competitions and falls back to the homepage for unknown IDs', () => {
    fixture.detectChanges();

    expect(title().getAttribute('href')).toBe('/competition/la-liga');

    fixture.componentRef.setInput('league', {
      ...EXAMPLE_STANDINGS.league,
      id: -1,
    });
    fixture.detectChanges();

    expect(title().getAttribute('href')).toBe('/');
  });

  it('updates competition logos on theme changes and renders responsive team logos', () => {
    fixture.componentRef.setInput('league', {
      ...EXAMPLE_STANDINGS.league,
      id: 39,
    });
    fixture.detectChanges();
    const logo: HTMLImageElement = query<HTMLImageElement>('th img');
    const lightSource = logo.getAttribute('src');
    const lightSet = logo.getAttribute('srcset');
    expect(lightSource).toBeTruthy();
    expect(lightSet).toContain('3x');

    const teamLogo: HTMLImageElement = query<HTMLImageElement>('tbody img');
    expect(teamLogo.getAttribute('src')).toContain('540');
    expect(teamLogo.getAttribute('srcset')).toContain('3x');
    expect(teamLogo.width).toBe(14);

    isSystemDark.set(true);
    fixture.detectChanges();

    expect(logo.getAttribute('src')).not.toBe(lightSource);
    expect(logo.getAttribute('srcset')).not.toBe(lightSet);

    isSystemDark.set(false);
    fixture.detectChanges();

    expect(logo.getAttribute('src')).toBe(lightSource);
  });
});
