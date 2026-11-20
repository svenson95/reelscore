import { TestBed } from '@angular/core/testing';

import type {
  LineupPlayer,
  MatchPlayerStatistics,
} from '@reelscore-sdk/models';

import type { LineupPlayerEvent } from './lineup-player-events';

import { FixtureLineupPlayerComponent } from './fixture-lineup-player.component';

const player: LineupPlayer = {
  id: 10,
  name: 'F. Wirtz',
  number: 17,
  pos: 'M',
  grid: '3:2',
};

describe('FixtureLineupPlayerComponent', () => {
  it('shows the player and events without statistics', () => {
    const fixture = TestBed.createComponent(FixtureLineupPlayerComponent);
    fixture.componentRef.setInput('player', player);
    fixture.componentRef.setInput('position', 'Mittelfeld');
    fixture.componentRef.setInput('playerEvents', [
      { type: 'goal', minute: "60'", label: "Tor 60'" },
    ] satisfies LineupPlayerEvent[]);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('F. Wirtz');
    expect(element.textContent).toContain('Mittelfeld');
    expect(element.querySelector('[aria-label="Tor 60\'"]')).not.toBeNull();
    expect(element.querySelector('details')).toBeNull();
    expect(element.querySelector('.rating')).toBeNull();
  });

  it('shows statistics, captain, goal count and rating in the expected order', () => {
    const fixture = TestBed.createComponent(FixtureLineupPlayerComponent);
    const statistics: MatchPlayerStatistics = {
      games: {
        minutes: 75,
        number: 17,
        position: 'M',
        rating: '9.18',
        captain: true,
        substitute: false,
      },
      offsides: null,
      shots: { total: null, on: 2 },
      goals: { total: 2, conceded: null, assists: 1, saves: null },
      passes: { total: 20, key: null, accuracy: null },
      tackles: { total: null, blocks: null, interceptions: null },
      duels: { total: null, won: null },
      dribbles: { attempts: null, success: null, past: null },
      fouls: { drawn: null, committed: null },
      cards: { yellow: 1, red: 0 },
      penalty: {
        won: null,
        commited: null,
        scored: null,
        missed: null,
        saved: null,
      },
    };
    fixture.componentRef.setInput('player', player);
    fixture.componentRef.setInput('statistics', statistics);
    fixture.componentRef.setInput('captain', true);
    fixture.componentRef.setInput('ratingClass', 'rating-bright-green');
    fixture.componentRef.setInput('formattedRating', '9.2');
    fixture.componentRef.setInput('playerEvents', [
      { type: 'substitution-out', minute: "75'", label: "Ausgewechselt 75'" },
      { type: 'yellow-card', minute: "45'", label: "Gelbe Karte 45'" },
      { type: 'goal', minute: "60', 71'", label: "2 Tore: 60', 71'", count: 2 },
    ] satisfies LineupPlayerEvent[]);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(
      element.querySelector('[aria-label="Mannschaftskapitän"]')
    ).not.toBeNull();
    expect(element.querySelector('.goal-count')?.textContent?.trim()).toBe('2');
    expect(element.querySelector('.rating')?.textContent?.trim()).toBe('9.2');
    expect(element.querySelector('dl')?.textContent).toContain('75');
    const summary = element.querySelector('summary');
    const content = Array.from(
      element.querySelectorAll('.goal-marker, .rating')
    );
    expect(content.map((item) => item.classList.contains('rating'))).toEqual([
      false,
      true,
    ]);
    expect(summary?.lastElementChild?.textContent?.trim()).toBe('expand_more');
  });
});
