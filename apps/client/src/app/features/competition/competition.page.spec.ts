import {
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  type WritableSignal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  type CompetitionData,
  LeagueService,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
  TabNavigationComponent,
  TabPanelDirective,
  TabViewComponent,
} from '@app/shared';

import {
  CompetitionStandingsStore,
  LastFixturesStore,
  NextFixturesStore,
  TopAssistsStore,
  TopScorersStore,
} from './state';

import { CompetitionPage } from './competition.page';

const createPointerEvent = (
  type: string,
  pointer: { pointerId: number; clientX: number; clientY: number }
): Event => {
  const event = new Event(type, { bubbles: true });

  Object.defineProperties(event, {
    pointerType: { value: 'touch' },
    pointerId: { value: pointer.pointerId },
    clientX: { value: pointer.clientX },
    clientY: { value: pointer.clientY },
  });

  return event;
};

const swipe = (element: HTMLElement, startX: number, endX: number): void => {
  element.dispatchEvent(
    createPointerEvent('pointerdown', {
      pointerId: 1,
      clientX: startX,
      clientY: 100,
    })
  );
  element.dispatchEvent(
    createPointerEvent('pointerup', {
      pointerId: 1,
      clientX: endX,
      clientY: 104,
    })
  );
};

describe('CompetitionPage', () => {
  let selectedLeague: WritableSignal<CompetitionData | undefined>;
  let route: WritableSignal<string | undefined>;
  let stores: {
    lastFixtures: { loadLastFixtures: jest.Mock };
    nextFixtures: { loadNextFixtures: jest.Mock };
    standings: { loadStandings: jest.Mock };
    topScorers: { loadTopScorers: jest.Mock };
    topAssists: { loadTopAssists: jest.Mock };
  };

  beforeEach(async () => {
    selectedLeague = signal<CompetitionData | undefined>(undefined);
    route = signal<string | undefined>(undefined);
    stores = {
      lastFixtures: { loadLastFixtures: jest.fn() },
      nextFixtures: { loadNextFixtures: jest.fn() },
      standings: { loadStandings: jest.fn() },
      topScorers: { loadTopScorers: jest.fn() },
      topAssists: { loadTopAssists: jest.fn() },
    };

    await TestBed.configureTestingModule({ imports: [CompetitionPage] })
      .overrideComponent(CompetitionPage, {
        set: {
          imports: [
            TabNavigationComponent,
            TabPanelDirective,
            TabViewComponent,
          ],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [
            {
              provide: LeagueService,
              useValue: {
                selectedLeague,
                setSelectedLeague: (competition: CompetitionData | undefined) =>
                  selectedLeague.set(competition),
              },
            },
            {
              provide: RouteService,
              useValue: { url: route.asReadonly() },
            },
            { provide: LastFixturesStore, useValue: stores.lastFixtures },
            { provide: NextFixturesStore, useValue: stores.nextFixtures },
            { provide: CompetitionStandingsStore, useValue: stores.standings },
            { provide: TopScorersStore, useValue: stores.topScorers },
            { provide: TopAssistsStore, useValue: stores.topAssists },
          ],
        },
      })
      .compileComponents();
  });

  it('loads each data store when the selected competition changes', () => {
    const competition = SELECT_COMPETITION_DATA_FLAT[0];
    const fixture = TestBed.createComponent(CompetitionPage);
    fixture.detectChanges();

    route.set(`/competition/${competition.url}`);
    TestBed.tick();

    expect(stores.lastFixtures.loadLastFixtures).toHaveBeenCalledWith(
      competition.id
    );
    expect(stores.nextFixtures.loadNextFixtures).toHaveBeenCalledWith(
      competition.id
    );
    expect(stores.standings.loadStandings).toHaveBeenCalledWith(
      competition.id,
      expect.any(String)
    );
    expect(stores.topScorers.loadTopScorers).toHaveBeenCalledWith(
      competition.id
    );
    expect(stores.topAssists.loadTopAssists).toHaveBeenCalledWith(
      competition.id
    );
  });

  it('keeps visited content mounted while switching competition tabs', () => {
    const fixture = TestBed.createComponent(CompetitionPage);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'rs-tab-navigation button'
    ) as NodeListOf<HTMLButtonElement>;

    expect(
      fixture.nativeElement.querySelector('rs-competition-last-fixtures')
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('rs-competition-next-fixtures')
    ).toBeNull();

    const panelSelectors = [
      'rs-competition-last-fixtures',
      'rs-competition-next-fixtures',
      'rs-competition-standings',
      'rs-competition-player-stats',
    ];

    for (const [index, selector] of panelSelectors.entries()) {
      buttons[index].click();
      fixture.detectChanges();

      expect(buttons[index].getAttribute('aria-pressed')).toBe('true');
      expect(fixture.nativeElement.querySelector(selector)).not.toBeNull();
    }

    expect(
      fixture.nativeElement.querySelector('rs-competition-last-fixtures')
        .parentElement.style.display
    ).toBe('none');
  });

  it('navigates to the next tab on a left swipe and spaces the content below the tab bar', () => {
    const fixture = TestBed.createComponent(CompetitionPage);
    fixture.detectChanges();

    const tabContent = fixture.nativeElement.querySelector(
      '.tab-content-transition'
    ) as HTMLElement;
    const tabBar = fixture.nativeElement.querySelector('rs-tab-navigation');

    swipe(tabContent, 180, 100);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'rs-tab-navigation button'
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(
      fixture.nativeElement.querySelector('.tab-panel.slide-in')
    ).not.toBeNull();
    expect(tabBar.classList).toContain('competition-tabs');

    swipe(tabContent, 100, 180);
    fixture.detectChanges();

    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
  });
});
