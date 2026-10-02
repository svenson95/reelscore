import { type Provider, signal, type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueService } from '@app/shared';

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
});

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
