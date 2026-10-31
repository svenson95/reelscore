import { NgTemplateOutlet } from '@angular/common';
import { Component, input, type Signal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OverviewContentComponent } from './content.component';
import { OverviewContentFacade } from './content.facade';

type ContentPanelSnapshot = {
  fixtures: unknown[];
  standings: unknown[];
  standingsHasData: boolean;
};

const fixturesInitialized = jest.fn();
const standingsInitialized = jest.fn();

@Component({
  selector: 'section[rs-overview-fixtures]',
  standalone: true,
  template: '',
})
class OverviewFixturesStubComponent {
  readonly filteredFixtures = input.required<unknown[]>();
  readonly isLoading = input.required<boolean>();
  readonly hasDataForSelectedDay = input.required<boolean>();
  readonly error = input.required<string | null>();

  constructor() {
    fixturesInitialized();
  }
}

@Component({
  selector: 'section[rs-overview-standings]',
  standalone: true,
  template: '',
})
class OverviewStandingsStubComponent {
  readonly weekStandings = input.required<unknown[]>();
  readonly isLoading = input.required<boolean>();
  readonly hasDataForSelectedDay = input.required<boolean>();
  readonly error = input.required<string | null>();

  constructor() {
    standingsInitialized();
  }
}

describe('OverviewContentComponent', () => {
  const selectedDay = signal('2026-10-01');
  const tabIndex = signal(0);

  const weekFixtures = signal<Array<unknown[] | undefined>>(
    Array(7).fill(undefined)
  );
  const fixturesLoading = signal(false);
  const fixturesError = signal<string | null>(null);
  const hasFixturesDataForSelectedDay = signal(false);

  const weekStandings = signal<Array<unknown[] | undefined>>(
    Array(7).fill(undefined)
  );
  const standingsLoading = signal(false);
  const standingsError = signal<string | null>(null);
  const hasStandingsDataForSelectedDay = signal(false);

  const facadeMock = {
    selectedDay,
    tabIndex,

    weekFixtures,
    fixturesLoading,
    fixturesError,
    hasFixturesDataForSelectedDay,

    weekStandings,
    standingsLoading,
    standingsError,
    hasStandingsDataForSelectedDay,
  };

  beforeEach(async () => {
    fixturesInitialized.mockClear();
    standingsInitialized.mockClear();

    tabIndex.set(0);
    selectedDay.set('2026-10-01');

    weekFixtures.set(Array(7).fill(undefined));
    fixturesLoading.set(false);
    fixturesError.set(null);
    hasFixturesDataForSelectedDay.set(false);

    weekStandings.set(Array(7).fill(undefined));
    standingsLoading.set(false);
    standingsError.set(null);
    hasStandingsDataForSelectedDay.set(false);

    await TestBed.configureTestingModule({
      imports: [OverviewContentComponent],
    })
      .overrideComponent(OverviewContentComponent, {
        set: {
          imports: [
            NgTemplateOutlet,
            OverviewFixturesStubComponent,
            OverviewStandingsStubComponent,
          ],
          providers: [
            {
              provide: OverviewContentFacade,
              useValue: facadeMock,
            },
          ],
        },
      })
      .compileComponents();
  });

  it('renders the selected day when navigation changes', () => {
    const selectedFixtures = [{ id: 'selected-fixture' }];
    const nextFixtures = [{ id: 'next-fixture' }];
    const selectedStandings = [{ id: 'selected-standing' }];
    const nextStandings = [{ id: 'next-standing' }];

    tabIndex.set(3);
    selectedDay.set('2026-10-04');
    weekFixtures.set([[], [], [], selectedFixtures, nextFixtures, [], []]);
    weekStandings.set([[], [], [], selectedStandings, nextStandings, [], []]);

    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();

    expect(fixturesInitialized).toHaveBeenCalledTimes(2);
    expect(standingsInitialized).toHaveBeenCalledTimes(2);

    const selectedFixturesComponent = fixture.debugElement.query(
      By.directive(OverviewFixturesStubComponent)
    ).componentInstance as OverviewFixturesStubComponent;
    const selectedStandingsComponent = fixture.debugElement.query(
      By.directive(OverviewStandingsStubComponent)
    ).componentInstance as OverviewStandingsStubComponent;

    expect(selectedFixturesComponent.filteredFixtures()).toEqual(
      selectedFixtures
    );
    expect(selectedStandingsComponent.weekStandings()).toEqual(
      selectedStandings
    );

    tabIndex.set(4);
    selectedDay.set('2026-10-05');
    fixture.detectChanges();

    const renderedFixtures = fixture.debugElement
      .queryAll(By.directive(OverviewFixturesStubComponent))
      .map((element) =>
        (
          element.componentInstance as OverviewFixturesStubComponent
        ).filteredFixtures()
      );
    const renderedStandings = fixture.debugElement
      .queryAll(By.directive(OverviewStandingsStubComponent))
      .map((element) =>
        (
          element.componentInstance as OverviewStandingsStubComponent
        ).weekStandings()
      );

    expect(renderedFixtures).toContain(nextFixtures);
    expect(renderedStandings).toContain(nextStandings);
  });

  it('keeps Sunday content in the outgoing panel when moving to the next Monday', () => {
    const sundayFixtures = [{ id: 'sunday-fixture' }];
    const mondayFixtures = [{ id: 'monday-fixture' }];
    const sundayStandings = [{ id: 'sunday-standing' }];
    const mondayStandings = [{ id: 'monday-standing' }];

    selectedDay.set('2026-10-25');
    tabIndex.set(6);
    weekFixtures.set([[], [], [], [], [], [], sundayFixtures]);
    weekStandings.set([[], [], [], [], [], [], sundayStandings]);
    hasStandingsDataForSelectedDay.set(true);

    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();

    selectedDay.set('2026-10-26');
    tabIndex.set(0);
    weekFixtures.set([mondayFixtures, [], [], [], [], [], []]);
    weekStandings.set([[], [], [], [], [], [], []]);
    standingsLoading.set(false);
    hasStandingsDataForSelectedDay.set(false);
    fixture.detectChanges();

    const renderedFixtures = fixture.debugElement
      .queryAll(By.directive(OverviewFixturesStubComponent))
      .map((element) =>
        (
          element.componentInstance as OverviewFixturesStubComponent
        ).filteredFixtures()
      );
    expect(renderedFixtures).toContain(mondayFixtures);

    const [outgoingPanel, incomingPanel] = (
      fixture.componentInstance as unknown as {
        contentPanels: Signal<[ContentPanelSnapshot, ContentPanelSnapshot]>;
      }
    ).contentPanels();

    expect(outgoingPanel.fixtures).toBe(sundayFixtures);
    expect(outgoingPanel.standings).toBe(sundayStandings);
    expect(incomingPanel.fixtures).toBe(mondayFixtures);
    expect(incomingPanel.standings).toEqual([]);
    expect(incomingPanel.standingsHasData).toBe(false);

    standingsLoading.set(true);
    fixture.detectChanges();

    const [, loadingIncomingPanel] = (
      fixture.componentInstance as unknown as {
        contentPanels: Signal<[ContentPanelSnapshot, ContentPanelSnapshot]>;
      }
    ).contentPanels();

    expect(loadingIncomingPanel.standings).toEqual([]);

    weekStandings.set([mondayStandings, [], [], [], [], [], []]);
    standingsLoading.set(false);
    hasStandingsDataForSelectedDay.set(true);
    fixture.detectChanges();

    const [, loadedIncomingPanel] = (
      fixture.componentInstance as unknown as {
        contentPanels: Signal<[ContentPanelSnapshot, ContentPanelSnapshot]>;
      }
    ).contentPanels();

    expect(loadedIncomingPanel.standings).toBe(mondayStandings);
  });

  it('slides content in the navigation direction', () => {
    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();

    const transitionElement = fixture.debugElement.query(
      By.css('.content-transition')
    ).nativeElement as HTMLElement;

    expect(transitionElement.style.getPropertyValue('--slide-in-offset')).toBe(
      '100%'
    );
    expect(transitionElement.style.getPropertyValue('--slide-out-offset')).toBe(
      '-100%'
    );

    selectedDay.set('2026-09-30');
    fixture.detectChanges();

    expect(transitionElement.style.getPropertyValue('--slide-in-offset')).toBe(
      '-100%'
    );
    expect(transitionElement.style.getPropertyValue('--slide-out-offset')).toBe(
      '100%'
    );
  });

  it('resets the horizontal animation when the overview route is detached', () => {
    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();

    selectedDay.set('2026-10-02');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.slide-in')).not.toBeNull();

    fixture.componentInstance.resetNavigationAnimation();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.slide-in')).toBeNull();
    expect(fixture.nativeElement.querySelector('.slide-out')).toBeNull();
  });

  it('should render fixtures and standings for cached selected-day data', () => {
    weekFixtures.set([
      [],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    hasFixturesDataForSelectedDay.set(true);

    weekStandings.set([
      [],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    hasStandingsDataForSelectedDay.set(true);

    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.directive(OverviewFixturesStubComponent))
    ).not.toBeNull();

    expect(
      fixture.debugElement.query(By.directive(OverviewStandingsStubComponent))
    ).not.toBeNull();
  });

  it('should render fixtures while the selected week is loading without cached data', () => {
    weekFixtures.set(Array(7).fill(undefined));
    fixturesLoading.set(true);
    hasFixturesDataForSelectedDay.set(false);

    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();

    const fixturesElement = fixture.debugElement.query(
      By.directive(OverviewFixturesStubComponent)
    );

    expect(fixturesElement).not.toBeNull();

    const component =
      fixturesElement.componentInstance as OverviewFixturesStubComponent;

    expect(component.filteredFixtures()).toEqual([]);
    expect(component.isLoading()).toBe(true);
    expect(component.hasDataForSelectedDay()).toBe(false);
  });

  it('should render standings while the selected week is loading without cached data', () => {
    weekStandings.set(Array(7).fill(undefined));
    standingsLoading.set(true);
    hasStandingsDataForSelectedDay.set(false);

    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();

    const standingsElement = fixture.debugElement.query(
      By.directive(OverviewStandingsStubComponent)
    );

    expect(standingsElement).not.toBeNull();

    const component =
      standingsElement.componentInstance as OverviewStandingsStubComponent;

    expect(component.weekStandings()).toEqual([]);
    expect(component.isLoading()).toBe(true);
    expect(component.hasDataForSelectedDay()).toBe(false);
  });
});
