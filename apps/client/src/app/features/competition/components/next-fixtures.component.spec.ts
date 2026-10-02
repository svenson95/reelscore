import { type Provider, signal, type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueService } from '@app/shared';

import { NextFixturesStore } from '../state';

import { NextFixturesComponent } from './next-fixtures.component';

describe('NextFixturesComponent', () => {
  it('shows loading, empty, and error states for upcoming fixtures', () => {
    const store = {
      fixtures: signal<[][] | null>(null),
      isLoading: signal(true),
      error: signal<unknown>(null),
    };
    const fixture = createPanel(NextFixturesComponent, [
      { provide: NextFixturesStore, useValue: store },
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
      'Keine anstehenden Spiele'
    );

    store.fixtures.set(null);
    store.error.set(new Error('Request failed'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Der Spielplan konnte nicht geladen werden'
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
