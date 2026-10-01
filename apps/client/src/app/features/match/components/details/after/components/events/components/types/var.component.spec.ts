import { TestBed } from '@angular/core/testing';

import {
  createMatchEvent,
  readElementTexts,
  renderComponent,
} from '../../../../../../../../../../testing/match-components.testing';

import { EventVarComponent } from './var.component';

describe('EventVarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EventVarComponent] });
  });

  it.each([
    ['Goal cancelled', 'Tor aberkannt'],
    ['Penalty confirmed', 'Elfmeter bestätigt'],
    ['Goal Disallowed - handball', 'Tor aberkannt - Handspiel'],
    ['Goal Disallowed - offside', 'Tor aberkannt - Abseits'],
  ] as const)('renders the VAR decision %s', (detail, label) => {
    const componentFixture = renderComponent(EventVarComponent, {
      event: createMatchEvent({ type: 'Var', detail }),
    });

    expect(readElementTexts(componentFixture.nativeElement, 'span')).toEqual([
      'VAR',
      label,
    ]);
  });
});
