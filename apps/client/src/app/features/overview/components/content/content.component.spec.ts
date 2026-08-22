import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import {
  HideHeaderDirective,
  OverviewContentComponent,
} from './content.component';
import { OverviewContentFacade } from './content.facade';

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
