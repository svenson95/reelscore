import { TestBed } from '@angular/core/testing';

import {
  renderComponent,
  readElementText,
  createMatchEvent,
} from '../../../../../../../../../../testing/match-components.testing';

import { EventGoalComponent } from './goal.component';

describe('EventGoalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EventGoalComponent] });
  });

  it('shows a distinct assisting player and removes the assist on an input update', () => {
    const componentFixture = renderComponent(EventGoalComponent, {
      event: createMatchEvent({ assist: { id: 11, name: 'Assist' } }),
    });

    expect(
      readElementText(componentFixture.nativeElement.querySelector('.top'))
    ).toBe('Scorer');
    expect(
      readElementText(componentFixture.nativeElement.querySelector('.assist'))
    ).toBe('Vorlage: Assist');

    componentFixture.componentRef.setInput(
      'event',
      createMatchEvent({ assist: { id: 10, name: 'Scorer' } })
    );
    componentFixture.detectChanges();

    expect(componentFixture.nativeElement.querySelector('.assist')).toBeNull();
    expect(readElementText(componentFixture.nativeElement)).toBe('Scorer');
  });

  it.each([
    ['Penalty', 'Elfmeter'],
    ['Missed Penalty', 'Verschossener Elfmeter'],
  ] as const)('labels %s without an assist', (detail, label) => {
    const componentFixture = renderComponent(EventGoalComponent, {
      event: createMatchEvent({ detail }),
    });

    expect(
      readElementText(componentFixture.nativeElement.querySelector('.top'))
    ).toBe('Scorer');
    expect(
      readElementText(componentFixture.nativeElement.querySelector('.bottom'))
    ).toBe(label);
  });
});
