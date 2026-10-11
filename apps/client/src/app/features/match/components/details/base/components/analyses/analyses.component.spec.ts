import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type {
  AnalysesDTO,
  GetFixtureDTO,
  LatestFixturesDTO,
} from '@reelscore-sdk/models';

import {
  EXAMPLE_FIXTURE,
  readElementText,
  renderComponent,
} from '@testing/client';

import {
  AnalysesStore,
  FixtureStore,
  LatestFixturesStore,
} from '../../../../../state';

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

  it('renders the analyses title once across loading, error, and empty states', () => {
    const componentFixture = renderComponent(MatchFixtureAnalysesComponent, {
      isLoading: true,
    });
    const hostElement = componentFixture.nativeElement as HTMLElement;
    const getAnalysesTitles = (): HTMLHeadingElement[] =>
      Array.from(
        hostElement.querySelectorAll<HTMLHeadingElement>('rs-page-title h2')
      ).filter((title) => title.textContent?.trim() === 'Analysen');

    expect(
      componentFixture.nativeElement.querySelector(
        '.analyses-skeleton[aria-busy="true"]'
      )
    ).not.toBeNull();
    expect(getAnalysesTitles()).toHaveLength(1);

    componentFixture.componentRef.setInput('isLoading', false);
    componentFixture.componentRef.setInput(
      'error',
      new Error('Request failed')
    );
    componentFixture.detectChanges();

    expect(getAnalysesTitles()).toHaveLength(1);

    componentFixture.componentRef.setInput('error', null);
    componentFixture.detectChanges();

    expect(getAnalysesTitles()).toHaveLength(1);
  });
});
