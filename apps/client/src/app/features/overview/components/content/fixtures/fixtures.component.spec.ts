import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { CompetitionWithFixtures } from '@app/shared';
import type { ExtendedFixtureDTO } from '@lib/models';

import { EXAMPLE_FIXTURE } from '../../../../../../testing/fixtures.mock';

import { OverviewFixturesComponent } from './fixtures.component';
import { OverviewFixturesFacade } from './fixtures.facade';
import { MatchDayListComponent } from './match-day-list.component';

@Component({
  selector: 'rs-start-match-day-list',
  standalone: true,
  template: '',
})
class MatchDayListStubComponent {
  readonly competition = input.required<CompetitionWithFixtures>();
}

describe('OverviewFixturesComponent', () => {
  const facadeMock: {
    groupFixturesByCompetition: jest.Mock<
      CompetitionWithFixtures[],
      [ExtendedFixtureDTO[]]
    >;
  } = {
    groupFixturesByCompetition: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewFixturesComponent],
    })
      .overrideComponent(OverviewFixturesComponent, {
        remove: {
          imports: [MatchDayListComponent],
          providers: [OverviewFixturesFacade],
        },
        add: {
          imports: [MatchDayListStubComponent],
          providers: [
            {
              provide: OverviewFixturesFacade,
              useValue: facadeMock,
            },
          ],
        },
      })
      .compileComponents();

    jest.clearAllMocks();
    facadeMock.groupFixturesByCompetition.mockReturnValue([]);
  });

  const createComponent = ({
    fixtures = [],
    isLoading = false,
    hasDataForSelectedDay = false,
    error = null,
  }: {
    fixtures?: ExtendedFixtureDTO[];
    isLoading?: boolean;
    hasDataForSelectedDay?: boolean;
    error?: string | null;
  } = {}) => {
    const fixture = TestBed.createComponent(OverviewFixturesComponent);

    fixture.componentRef.setInput('filteredFixtures', fixtures);
    fixture.componentRef.setInput('isLoading', isLoading);
    fixture.componentRef.setInput(
      'hasDataForSelectedDay',
      hasDataForSelectedDay
    );
    fixture.componentRef.setInput('error', error);

    fixture.detectChanges();

    return fixture;
  };

  it('should display an empty state when no fixtures are available', () => {
    const fixture = createComponent();

    expect(fixture.nativeElement.textContent).toContain(
      'Es finden keine Spiele statt.'
    );
  });

  it('should display a loading state while fixtures are loading without data for the selected day', () => {
    const fixture = createComponent({
      isLoading: true,
      hasDataForSelectedDay: false,
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="fixtures-loading"]')
    ).not.toBeNull();

    expect(fixture.nativeElement.textContent).not.toContain(
      'Es finden keine Spiele statt.'
    );
  });

  it('should display the empty state instead of loading while cached data for the selected day is available', () => {
    const fixture = createComponent({
      isLoading: true,
      hasDataForSelectedDay: true,
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="fixtures-loading"]')
    ).toBeNull();

    expect(fixture.nativeElement.textContent).toContain(
      'Es finden keine Spiele statt.'
    );
  });

  it('should keep fixtures visible while another week is loading', () => {
    const competition: CompetitionWithFixtures = {
      id: EXAMPLE_FIXTURE.league.id,
      name: EXAMPLE_FIXTURE.league.name,
      image: EXAMPLE_FIXTURE.league.flag || 'error',
      url: ['/', 'competition', 'champions-league'],
      fixtures: [EXAMPLE_FIXTURE],
    };

    facadeMock.groupFixturesByCompetition.mockReturnValue([competition]);

    const fixture = createComponent({
      fixtures: [EXAMPLE_FIXTURE],
      isLoading: true,
      hasDataForSelectedDay: true,
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="fixtures-loading"]')
    ).toBeNull();

    expect(
      fixture.nativeElement.querySelector('rs-start-match-day-list')
    ).not.toBeNull();
  });

  it('should display an error state when fixtures could not be loaded', () => {
    const fixture = createComponent({
      error: 'Request failed',
    });

    expect(fixture.nativeElement.textContent).toContain(
      'Fehler beim Laden der Spiele.'
    );

    expect(fixture.nativeElement.textContent).not.toContain(
      'Es finden keine Spiele statt.'
    );
  });

  it('should prefer the loading state over an error when no data for the selected day is available', () => {
    const fixture = createComponent({
      isLoading: true,
      hasDataForSelectedDay: false,
      error: 'Request failed',
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="fixtures-loading"]')
    ).not.toBeNull();

    expect(fixture.nativeElement.textContent).not.toContain(
      'Fehler beim Laden der Spiele.'
    );
  });

  it('should not display the loading state while data for the selected day is available', () => {
    const fixture = createComponent({
      isLoading: true,
      hasDataForSelectedDay: true,
      error: 'Request failed',
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="fixtures-loading"]')
    ).toBeNull();
  });
});
