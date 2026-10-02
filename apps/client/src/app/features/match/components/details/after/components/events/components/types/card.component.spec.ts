import { TestBed } from '@angular/core/testing';

import {
  createMatchEvent,
  readElementText,
  renderComponent,
} from '@testing/client';

import { EventCardComponent } from './card.component';

describe('EventCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EventCardComponent] });
  });

  it.each([
    ['Tripping', 'Foul durch Beinstellen'],
    ['Roughing', 'Grobes Foul'],
    ['Argument', 'Auseinandersetzung'],
    ['Holding', 'Festhalten'],
    ['Delay of game', 'Zeitspiel'],
    ['Elbowing', 'Ellbogenstoß'],
    ['Unsportsmanlike conduct', 'Unsportliches Verhalten'],
    ['Serious foul', 'Schweres Foul'],
    ['Diving', 'Schwalbe'],
    ['misses next match', 'Gelbsperre - Fehlt im nächsten Spiel'],
    ['Unknown reason', 'Unknown reason'],
    ['', ''],
  ])(
    'translates the card reason %s with a fallback for unknown comments',
    (comments, label) => {
      const componentFixture = renderComponent(EventCardComponent, {
        event: createMatchEvent({
          type: 'Card',
          detail: 'Yellow Card',
          comments,
        }),
      });

      expect(readElementText(componentFixture.nativeElement)).toBe(
        ('Scorer ' + label).trim()
      );
    }
  );
});
