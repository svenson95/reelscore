import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EXAMPLE_FIXTURE, renderComponent } from '@testing/client';

import { ALLIANZ_ARENA_ID, ScrollService, VenueImageService } from './services';

import { MatchHeaderComponent } from './match-header.component';
import { VENUE_IDS } from './venue-ids.data';

const scrollServiceMock = {
  observeScrollPosition: jest.fn(),
  destroy: jest.fn(),
  setAnimationWrapper: jest.fn(),
  hasVisibleHeight: signal(true),
};

const venueImageServiceMock = {
  setVenueId: jest.fn(),
  hasValidVenueBackground: signal(false),
  venueBackgroundLoaded: signal(false),
  venueBackgroundImage: signal(undefined),
};

describe('MatchHeaderComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    venueImageServiceMock.hasValidVenueBackground.set(false);
    venueImageServiceMock.venueBackgroundLoaded.set(false);

    TestBed.configureTestingModule({
      imports: [MatchHeaderComponent],
    }).overrideComponent(MatchHeaderComponent, {
      set: {
        providers: [
          { provide: ScrollService, useValue: scrollServiceMock },
          { provide: VenueImageService, useValue: venueImageServiceMock },
        ],
      },
    });
  });

  it('updates the venue, observes scrolling and cleans up when destroyed', () => {
    const componentFixture = renderComponent(MatchHeaderComponent, {
      data: null,
      highlights: null,
    });

    expect(venueImageServiceMock.setVenueId).toHaveBeenLastCalledWith(null);
    expect(scrollServiceMock.observeScrollPosition).toHaveBeenCalledTimes(1);

    componentFixture.componentRef.setInput('data', EXAMPLE_FIXTURE);
    componentFixture.detectChanges();

    expect(venueImageServiceMock.setVenueId).toHaveBeenLastCalledWith(
      VENUE_IDS[85]
    );

    componentFixture.componentRef.setInput('data', {
      ...EXAMPLE_FIXTURE,
      teams: {
        ...EXAMPLE_FIXTURE.teams,
        home: { ...EXAMPLE_FIXTURE.teams.home, id: -1 },
      },
    });
    componentFixture.detectChanges();

    expect(venueImageServiceMock.setVenueId).toHaveBeenLastCalledWith(
      ALLIANZ_ARENA_ID
    );

    componentFixture.destroy();

    expect(scrollServiceMock.destroy).toHaveBeenCalledTimes(1);
  });

  it('shows highlights only when data and regular or penalty goals exist', () => {
    const componentFixture = renderComponent(MatchHeaderComponent, {
      data: EXAMPLE_FIXTURE,
      highlights: [],
    });

    expect(
      componentFixture.nativeElement.querySelector('rs-match-highlights')
    ).not.toBeNull();

    componentFixture.componentRef.setInput('data', {
      ...EXAMPLE_FIXTURE,
      goals: { home: 0, away: 0 },
      score: { ...EXAMPLE_FIXTURE.score, penalty: { home: null, away: null } },
    });
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('rs-match-highlights')
    ).toBeNull();

    componentFixture.componentRef.setInput('data', {
      ...EXAMPLE_FIXTURE,
      goals: { home: 0, away: 0 },
    });
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('rs-match-highlights')
    ).not.toBeNull();

    componentFixture.componentRef.setInput('highlights', null);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('rs-match-highlights')
    ).toBeNull();
  });

  it('applies the background only when it is loaded and valid', () => {
    const componentFixture = renderComponent(MatchHeaderComponent, {
      data: null,
      highlights: null,
    });
    const backgroundElement = componentFixture.nativeElement.querySelector(
      '.background-wrapper'
    );

    expect(
      backgroundElement.classList.contains('background-wrapper--loaded')
    ).toBe(false);

    venueImageServiceMock.hasValidVenueBackground.set(true);
    venueImageServiceMock.venueBackgroundLoaded.set(true);
    componentFixture.detectChanges();

    expect(
      backgroundElement.classList.contains('background-wrapper--loaded')
    ).toBe(true);
  });
});
