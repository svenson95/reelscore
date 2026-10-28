import { TestBed } from '@angular/core/testing';

import {
  createMatchEvent,
  readElementTexts,
  renderComponent,
} from '@testing/client';

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
    ['Card upgrade confirmed', 'Rote Karte bestätigt'],
  ] as const)('renders the VAR decision %s', (detail, label) => {
    const componentFixture = renderComponent(EventVarComponent, {
      event: createVarEventWithDetail(detail),
    });

    expect(readElementTexts(componentFixture.nativeElement, 'span')).toEqual([
      'VAR',
      label,
    ]);
  });

  it('renders an unknown VAR decision without translation', () => {
    const componentFixture = renderComponent(EventVarComponent, {
      event: createVarEventWithDetail('Unknown VAR decision'),
    });

    expect(readElementTexts(componentFixture.nativeElement, 'span')).toEqual([
      'VAR',
      'Unknown VAR decision',
    ]);
  });
});

function createVarEventWithDetail(detail: string) {
  return {
    ...createMatchEvent({ type: 'Var', detail: 'Goal cancelled' }),
    detail,
  };
}
