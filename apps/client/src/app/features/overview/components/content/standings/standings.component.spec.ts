import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { StandingsTableComponent } from '@app/shared';
import type { StandingsDTO } from '@lib/models';

import { OverviewStandingsComponent } from './standings.component';
import { OverviewStandingsFacade } from './standings.facade';

@Component({
  selector: 'rs-standings-table',
  standalone: true,
  template: '',
})
class StandingsTableStubComponent {
  readonly ranks = input<unknown>();
  readonly league = input<unknown>();
  readonly header = input<string>();
}

describe('OverviewStandingsComponent', () => {
  const dayStandings = signal<StandingsDTO | null>(null);
  const isFiltering = signal(false);
  const hasMultipleGroups = signal(false);
  const showHomeAndAwayStandings = signal(false);

  const facadeMock = {
    dayStandings,
    isFiltering,
    hasMultipleGroups,
    showHomeAndAwayStandings,
  };

  beforeEach(async () => {
    dayStandings.set(null);
    isFiltering.set(false);
    hasMultipleGroups.set(false);
    showHomeAndAwayStandings.set(false);

    await TestBed.configureTestingModule({
      imports: [OverviewStandingsComponent],
    })
      .overrideComponent(OverviewStandingsComponent, {
        remove: {
          imports: [StandingsTableComponent],
          providers: [OverviewStandingsFacade],
        },
        add: {
          imports: [StandingsTableStubComponent],
          providers: [
            {
              provide: OverviewStandingsFacade,
              useValue: facadeMock,
            },
          ],
        },
      })
      .compileComponents();
  });

  const createComponent = ({
    standings = [],
    isLoading = false,
    hasDataForSelectedDay = false,
    error = null,
  }: {
    standings?: StandingsDTO[];
    isLoading?: boolean;
    hasDataForSelectedDay?: boolean;
    error?: string | null;
  } = {}) => {
    const fixture = TestBed.createComponent(OverviewStandingsComponent);

    fixture.componentRef.setInput('weekStandings', standings);
    fixture.componentRef.setInput('isLoading', isLoading);
    fixture.componentRef.setInput(
      'hasDataForSelectedDay',
      hasDataForSelectedDay
    );
    fixture.componentRef.setInput('error', error);

    fixture.detectChanges();

    return fixture;
  };

  it('should display an empty state when no standings are available', () => {
    const fixture = createComponent();

    expect(fixture.nativeElement.textContent).toContain(
      'Keine Tabellen gefunden.'
    );
  });

  it('should display a loading state while standings are loading without data for the selected day', () => {
    const fixture = createComponent({
      isLoading: true,
      hasDataForSelectedDay: false,
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="standings-loading"]')
    ).not.toBeNull();

    expect(fixture.nativeElement.textContent).not.toContain(
      'Keine Tabellen gefunden.'
    );
  });

  it('should display the empty state instead of loading while cached data for the selected day is available', () => {
    const fixture = createComponent({
      isLoading: true,
      hasDataForSelectedDay: true,
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="standings-loading"]')
    ).toBeNull();

    expect(fixture.nativeElement.textContent).toContain(
      'Keine Tabellen gefunden.'
    );
  });

  it('should display an error state when standings could not be loaded', () => {
    const fixture = createComponent({
      error: 'Request failed',
    });

    expect(fixture.nativeElement.textContent).toContain(
      'Fehler beim Laden der Tabellen.'
    );

    expect(fixture.nativeElement.textContent).not.toContain(
      'Keine Tabellen gefunden.'
    );
  });

  it('should prefer the loading state over an error when no data for the selected day is available', () => {
    const fixture = createComponent({
      isLoading: true,
      hasDataForSelectedDay: false,
      error: 'Request failed',
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="standings-loading"]')
    ).not.toBeNull();

    expect(fixture.nativeElement.textContent).not.toContain(
      'Fehler beim Laden der Tabellen.'
    );
  });

  it('should display top five title when no competition filter is active', () => {
    const fixture = createComponent();

    expect(fixture.nativeElement.textContent).toContain('Tabellen Top 5');
  });

  it('should display standings title when competition filter is active', () => {
    isFiltering.set(true);

    const fixture = createComponent();

    expect(fixture.nativeElement.textContent).toContain('Tabellen');
    expect(fixture.nativeElement.textContent).not.toContain('Tabellen Top 5');
  });
});
