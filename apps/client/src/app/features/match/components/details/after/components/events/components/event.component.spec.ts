import { TestBed } from '@angular/core/testing';

import {
  createMatchEvent,
  readElementTexts,
  renderComponent,
} from '@testing/client';

import { MatchEventComponent } from './event.component';

describe('MatchEventComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatchEventComponent] });
  });

  it.each([
    ['Goal', 'Normal Goal', 'rs-event-goal'],
    ['Card', 'Yellow Card', 'rs-event-card'],
    ['subst', 'Substitution', 'rs-event-substitution'],
    ['Var', 'Goal cancelled', 'rs-event-var'],
  ] as const)(
    'renders the %s component and updates the team alignment',
    (type, detail, selector) => {
      const event = createMatchEvent({ type, detail });
      const componentFixture = renderComponent(MatchEventComponent, {
        event,
        homeTeamId: 85,
      });

      expect(
        componentFixture.nativeElement.querySelector(selector)
      ).not.toBeNull();
      expect(componentFixture.nativeElement.classList.contains('is-home')).toBe(
        true
      );

      componentFixture.componentRef.setInput('homeTeamId', 42);
      componentFixture.detectChanges();

      expect(componentFixture.nativeElement.classList.contains('is-home')).toBe(
        false
      );
    }
  );

  it('replaces event types without retaining the previous display', () => {
    const componentFixture = renderComponent(MatchEventComponent, {
      event: createMatchEvent(),
      homeTeamId: 85,
    });

    componentFixture.componentRef.setInput(
      'event',
      createMatchEvent({ type: 'Var', detail: 'Goal cancelled' })
    );
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('rs-event-goal')
    ).toBeNull();
    expect(
      readElementTexts(componentFixture.nativeElement, 'rs-event-var span')
    ).toEqual(['VAR', 'Tor aberkannt']);
  });
});
