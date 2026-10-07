import { type Provider, signal, type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAssistsStore, TopScorersStore } from '../state';

import { PlayerStatsComponent } from './player-stats.component';

describe('PlayerStatsComponent', () => {
  it('shows loading, no-data, and error states for player statistics', () => {
    const topScorers = signal<{ response: never[] } | null>(null);
    const topAssists = signal<{ response: never[] } | null>(null);
    const topScorersStore = {
      topScorers,
      isLoading: signal(true),
      error: signal<unknown>(null),
    };
    const topAssistsStore = {
      topAssists,
      isLoading: signal(true),
      error: signal<unknown>(null),
    };
    const fixture = createPanel(PlayerStatsComponent, [
      { provide: TopScorersStore, useValue: topScorersStore },
      { provide: TopAssistsStore, useValue: topAssistsStore },
    ]);

    expect(fixture.nativeElement.textContent).toContain(
      'Spieler-Statistiken werden geladen'
    );

    topScorersStore.isLoading.set(false);
    topAssistsStore.isLoading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Keine Daten gefunden');

    topScorers.set({ response: [] });
    topAssists.set({ response: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Keine Torschützen vorhanden'
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Keine Vorlagengeber vorhanden'
    );

    topScorers.set(null);
    topScorersStore.error.set(new Error('Request failed'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Spieler-Statistiken konnten nicht geladen werden'
    );
  });

  it('shows an error when top assists cannot be loaded', () => {
    const fixture = createPanel(PlayerStatsComponent, [
      {
        provide: TopScorersStore,
        useValue: {
          topScorers: signal<{ response: never[] } | null>(null),
          isLoading: signal(false),
          error: signal<unknown>(null),
        },
      },
      {
        provide: TopAssistsStore,
        useValue: {
          topAssists: signal<{ response: never[] } | null>(null),
          isLoading: signal(false),
          error: signal<unknown>(new Error('Top assists request failed')),
        },
      },
    ]);

    expect(fixture.nativeElement.textContent).toContain(
      'Spieler-Statistiken konnten nicht geladen werden'
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
