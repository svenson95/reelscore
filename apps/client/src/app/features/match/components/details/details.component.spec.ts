import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';

import { EXAMPLE_FIXTURE } from '@testing/client';

import { PageTitleComponent } from '@app/shared';

import { MatchFixtureDataComponent } from './base/components';

import { MatchDetailsComponent } from './details.component';
import { MatchDetailsFacade } from './details.facade';

describe('MatchDetailsComponent', () => {
  const createFacadeMock = () => ({
    fixture: signal({ data: EXAMPLE_FIXTURE, highlights: [] }),
    standings: signal(null),
    analyses: signal<unknown>(null),
    events: signal<unknown>(null),
    statistics: signal<unknown>(null),
    evaluations: signal(null),
    latestFixtures: signal(null),
    teamCoaches: signal([]),
    teamCoachesLoading: signal(false),
    teamCoachesError: signal(null),
    hasNoStandings: signal(false),
    isKoPhase: signal(false),
    isQualifyPhase: signal(false),
    hasMultipleGroups: signal(false),
    detailsLoading: signal(false),
    standingsLoading: signal(false),
    evaluationsLoading: signal(false),
    latestFixturesLoading: signal(false),
    standingsError: signal(null),
    evaluationsError: signal(null),
    latestFixturesError: signal(null),
  });
  let facadeMock: ReturnType<typeof createFacadeMock>;

  beforeEach(async () => {
    facadeMock = createFacadeMock();

    await TestBed.configureTestingModule({ imports: [MatchDetailsComponent] })
      .overrideComponent(MatchDetailsComponent, {
        set: {
          imports: [
            MatTabsModule,
            MatIconModule,
            PageTitleComponent,
            MatchFixtureDataComponent,
          ],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [{ provide: MatchDetailsFacade, useValue: facadeMock }],
        },
      })
      .compileComponents();
  });

  const createComponent = () => {
    const view = TestBed.createComponent(MatchDetailsComponent);
    view.detectChanges();
    return view;
  };

  it('should pass fixture data and loading changes to the details view', () => {
    const view = createComponent();
    expect(view.nativeElement.textContent).toContain('Puskas Arena');
    expect(view.nativeElement.querySelector('.rs-skeleton')).toBeNull();

    facadeMock.detailsLoading.set(true);
    view.detectChanges();

    expect(view.nativeElement.textContent).not.toContain('Puskas Arena');
    expect(view.nativeElement.querySelectorAll('.rs-skeleton')).toHaveLength(5);
  });

  it.each(['hasNoStandings', 'isKoPhase', 'isQualifyPhase'] as const)(
    'should hide standings when %s applies and restore them when it no longer applies',
    (condition) => {
      const view = createComponent();
      expect(
        view.nativeElement.querySelector('rs-match-fixture-standings')
      ).not.toBeNull();

      facadeMock[condition].set(true);
      view.detectChanges();

      expect(
        view.nativeElement.querySelector('rs-match-fixture-standings')
      ).toBeNull();

      facadeMock[condition].set(false);
      view.detectChanges();

      expect(
        view.nativeElement.querySelector('rs-match-fixture-standings')
      ).not.toBeNull();
    }
  );

  it('should enable optional tabs only when their data is available', async () => {
    const view = createComponent();
    const group = await TestbedHarnessEnvironment.loader(view).getHarness(
      MatTabGroupHarness
    );
    const tabs = await group.getTabs();

    expect(await Promise.all(tabs.map((tab) => tab.isDisabled()))).toEqual([
      false,
      true,
      true,
      true,
    ]);

    facadeMock.analyses.set({});
    facadeMock.events.set([]);
    facadeMock.statistics.set([]);
    view.detectChanges();

    expect(await Promise.all(tabs.map((tab) => tab.isDisabled()))).toEqual([
      false,
      false,
      false,
      false,
    ]);
  });

  it.each([
    ['analyses', 1],
    ['events', 2],
    ['statistics', 3],
  ] as const)(
    'should return to details when the selected %s tab loses its data',
    async (source, index) => {
      facadeMock[source].set([]);
      const view = createComponent();
      const group = await TestbedHarnessEnvironment.loader(view).getHarness(
        MatTabGroupHarness
      );
      const tabs = await group.getTabs();
      await tabs[index].select();

      expect(await tabs[index].isSelected()).toBe(true);

      facadeMock[source].set(null);
      view.detectChanges();

      expect(await tabs[0].isSelected()).toBe(true);
      expect(await tabs[index].isDisabled()).toBe(true);
    }
  );
});
