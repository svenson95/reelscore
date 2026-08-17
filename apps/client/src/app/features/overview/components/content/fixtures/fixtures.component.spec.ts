import { TestBed } from '@angular/core/testing';

import type { ExtendedFixtureDTO } from '@lib/models';

import { OverviewFixturesComponent } from './fixtures.component';
import { OverviewFixturesFacade } from './fixtures.facade';

describe('OverviewFixturesComponent', () => {
  const facadeMock = {
    initCompetitionsWithFixtures: jest.fn(() => []),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewFixturesComponent],
    })
      .overrideComponent(OverviewFixturesComponent, {
        set: {
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
    facadeMock.initCompetitionsWithFixtures.mockReturnValue([]);
  });

  const createComponent = ({
    fixtures = [],
    isLoading = false,
    error = null,
  }: {
    fixtures?: ExtendedFixtureDTO[];
    isLoading?: boolean;
    error?: string | null;
  } = {}) => {
    const fixture = TestBed.createComponent(OverviewFixturesComponent);

    fixture.componentRef.setInput('filteredFixtures', fixtures);
    fixture.componentRef.setInput('isLoading', isLoading);
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

  it('should display a loading state while fixtures are loading', () => {
    const fixture = createComponent({
      isLoading: true,
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="fixtures-loading"]')
    ).not.toBeNull();

    expect(fixture.nativeElement.textContent).not.toContain(
      'Es finden keine Spiele statt.'
    );
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

  it('should prefer the loading state while fixtures are loading', () => {
    const fixture = createComponent({
      isLoading: true,
      error: 'Request failed',
    });

    expect(
      fixture.nativeElement.querySelector('[data-testid="fixtures-loading"]')
    ).not.toBeNull();

    expect(fixture.nativeElement.textContent).not.toContain(
      'Fehler beim Laden der Spiele.'
    );
  });
});
