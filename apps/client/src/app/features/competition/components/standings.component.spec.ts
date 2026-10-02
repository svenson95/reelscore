import { type Provider, signal, type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionStandingsStore } from '../state';

import { CompetitionStandingsComponent } from './standings.component';

describe('CompetitionStandingsComponent', () => {
  it('shows loading, no-data, and error states for standings', () => {
    const store = {
      standings: signal(null),
      isLoading: signal(true),
      error: signal<unknown>(null),
    };
    const fixture = createPanel(CompetitionStandingsComponent, [
      { provide: CompetitionStandingsStore, useValue: store },
    ]);

    expect(fixture.nativeElement.textContent).toContain('Tabelle wird geladen');

    store.isLoading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Keine Tabelle vorhanden'
    );

    store.error.set(new Error('Request failed'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Die Tabelle konnte nicht geladen werden'
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
