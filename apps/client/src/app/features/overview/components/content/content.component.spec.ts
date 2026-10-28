import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import {
  HideHeaderDirective,
  OverviewContentComponent,
} from './content.component';
import { OverviewContentFacade } from './content.facade';

const fixturesInitialized = jest.fn();
const standingsInitialized = jest.fn();

@Component({
  selector: 'rs-overview-fixtures',
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
  selector: 'rs-overview-standings',
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
    tabIndex,
    weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],

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
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(OverviewContentComponent, {
        set: {
          imports: [
            MatTabsModule,
            HideHeaderDirective,
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

  it('initializes only the selected day and renders another day when selected', async () => {
    const selectedFixtures = [{ id: 'selected-fixture' }];
    const nextFixtures = [{ id: 'next-fixture' }];
    const selectedStandings = [{ id: 'selected-standing' }];
    const nextStandings = [{ id: 'next-standing' }];

    tabIndex.set(3);
    weekFixtures.set([[], [], [], selectedFixtures, nextFixtures, [], []]);
    weekStandings.set([[], [], [], selectedStandings, nextStandings, [], []]);

    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixturesInitialized).toHaveBeenCalledTimes(1);
    expect(standingsInitialized).toHaveBeenCalledTimes(1);

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
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixturesInitialized).toHaveBeenCalledTimes(2);
    expect(standingsInitialized).toHaveBeenCalledTimes(2);

    const nextFixturesComponent = fixture.debugElement.query(
      By.directive(OverviewFixturesStubComponent)
    ).componentInstance as OverviewFixturesStubComponent;
    const nextStandingsComponent = fixture.debugElement.query(
      By.directive(OverviewStandingsStubComponent)
    ).componentInstance as OverviewStandingsStubComponent;

    expect(nextFixturesComponent.filteredFixtures()).toEqual(nextFixtures);
    expect(nextStandingsComponent.weekStandings()).toEqual(nextStandings);
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

  it('keeps height dynamic and disables pagination for the hidden tab header', () => {
    const fixture = TestBed.createComponent(OverviewContentComponent);

    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(MatTabGroup))
      .componentInstance as MatTabGroup;

    expect(tabGroup.dynamicHeight).toBe(true);
    expect(tabGroup.disablePagination).toBe(true);
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
