import { type Provider, signal, type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { COMPETITION_ROUNDS } from '@reelscore-sdk/constants';
import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

import {
  LeagueService,
  SELECT_COMPETITION_DATA_FLAT,
  ThemeService,
} from '@app/shared';

import { EXAMPLE_FIXTURE } from '../../../../testing';
import { LastFixturesStore } from '../state';

import { LastFixturesComponent } from './last-fixtures.component';

describe('LastFixturesComponent', () => {
  it('shows loading, empty, and error states for recent fixtures', () => {
    const store = {
      fixtures: signal<[][] | null>(null),
      isLoading: signal(true),
      error: signal<unknown>(null),
      showAll: signal(false),
      loadLastFixtures: jest.fn(),
    };
    const fixture = createPanel(LastFixturesComponent, [
      { provide: LastFixturesStore, useValue: store },
      {
        provide: LeagueService,
        useValue: { selectedLeague: signal(undefined) },
      },
    ]);

    expect(fixture.nativeElement.textContent).toContain(
      'Spiele werden geladen'
    );

    store.isLoading.set(false);
    store.fixtures.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Keine vergangenen Spiele'
    );

    store.fixtures.set(null);
    store.error.set(new Error('Request failed'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Ergebnisse konnten nicht geladen werden'
    );
  });

  it('shows the load-all button only after the third matchday', () => {
    const rounds = [
      ...new Set(
        Object.values(COMPETITION_ROUNDS[2026]?.[140] ?? {}).map(
          (round) => round.match(/\d+$/)?.[0] ?? round
        )
      ),
    ];
    const store = {
      fixtures: signal<ExtendedFixtureDTO[][] | null>(null),
      isLoading: signal(false),
      error: signal<unknown>(null),
      showAll: signal(false),
      loadLastFixtures: jest.fn(),
    };
    const fixture = createPanel(LastFixturesComponent, [
      { provide: LastFixturesStore, useValue: store },
      {
        provide: LeagueService,
        useValue: {
          selectedLeague: signal(
            SELECT_COMPETITION_DATA_FLAT.find(
              (competition) => competition.id === 140
            )
          ),
        },
      },
      { provide: ThemeService, useValue: { isSystemDark: signal(false) } },
    ]);

    expect(fixture.componentInstance.hasMoreThanThreeRounds()).toBe(false);

    store.fixtures.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    store.fixtures.set([[createFixtureForRound(rounds[1] ?? 'Round 2')]]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    store.fixtures.set([[createFixtureForRound(rounds[3] ?? 'Round 4')]]);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('button')?.textContent
    ).toContain('Alle anzeigen');

    store.showAll.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    store.showAll.set(false);
    store.fixtures.set([[createFixtureForRound('Unknown round', 999)]]);
    expect(fixture.componentInstance.hasMoreThanThreeRounds()).toBe(false);

    store.fixtures.set([[createFixtureForRound('Unknown season', 999, 1900)]]);
    expect(fixture.componentInstance.hasMoreThanThreeRounds()).toBe(false);

    store.fixtures.set([[createFixtureForRound('Final')]]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});

function createFixtureForRound(
  round: string,
  competitionId = 140,
  season = 2026
): ExtendedFixtureDTO {
  return {
    ...EXAMPLE_FIXTURE,
    league: {
      ...EXAMPLE_FIXTURE.league,
      id: competitionId,
      season,
      round,
    },
  };
}

function createPanel<TComponent>(
  component: Type<TComponent>,
  providers: Provider[]
): ComponentFixture<TComponent> {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ imports: [component], providers });

  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();

  return fixture;
}
