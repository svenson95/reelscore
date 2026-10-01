import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { GetFixtureDTO, LatestFixturesDTO } from '@reelscore-sdk/models';

import type { AnalysesDTO } from '@lib/models';

import { EXAMPLE_FIXTURE } from '../../../../../../../../testing/fixtures.mock';
import {
  readElementText,
  renderComponent,
} from '../../../../../../../../testing/match-components.testing';
import {
  AnalysesStore,
  FixtureStore,
  LatestFixturesStore,
} from '../../../../../stores';

import { MatchFixtureAnalysesComponent } from './analyses.component';

const fixtureState = signal<GetFixtureDTO | null>(null);
const analysesState = signal<AnalysesDTO | null>(null);
const latestFixturesState = signal<LatestFixturesDTO | null>(null);

describe('MatchFixtureAnalysesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchFixtureAnalysesComponent],
      providers: [
        { provide: FixtureStore, useValue: { fixture: fixtureState } },
        { provide: AnalysesStore, useValue: { analyses: analysesState } },
        {
          provide: LatestFixturesStore,
          useValue: { latestFixtures: latestFixturesState },
        },
      ],
    });
  });

  it('renders predictions and recent-match analyses independently as store data becomes available', () => {
    const componentFixture = renderComponent(MatchFixtureAnalysesComponent, {});

    expect(
      componentFixture.nativeElement.querySelector(
        'rs-match-fixture-analyses-predictions'
      )
    ).toBeNull();
    expect(
      componentFixture.nativeElement.querySelector(
        'rs-match-fixture-analyses-last-fixtures'
      )
    ).toBeNull();

    analysesState.set({
      playersWithStreak: { home: ['Striker'], away: [] },
      homeOrAwayStrong: null,
    });
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Striker'
    );

    latestFixturesState.set({ home: [], away: [] });
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector(
        'rs-match-fixture-analyses-last-fixtures'
      )
    ).toBeNull();

    fixtureState.set({ data: EXAMPLE_FIXTURE, highlights: [] });
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector(
        'rs-match-fixture-analyses-last-fixtures'
      )
    ).not.toBeNull();

    fixtureState.set(null);
    analysesState.set(null);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector(
        'rs-match-fixture-analyses-last-fixtures'
      )
    ).toBeNull();
    expect(
      componentFixture.nativeElement.querySelector(
        'rs-match-fixture-analyses-predictions'
      )
    ).toBeNull();
  });
});
