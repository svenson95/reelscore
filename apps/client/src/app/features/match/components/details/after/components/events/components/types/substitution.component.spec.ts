import { TestBed } from '@angular/core/testing';

import {
  renderComponent,
  createMatchEvent,
  readElementTexts,
} from '../../../../../../../../../../testing/match-components.testing';

import { EventSubstitutionComponent } from './substitution.component';

describe('EventSubstitutionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EventSubstitutionComponent] });
  });

  it('shows the incoming player before the outgoing player and updates both', () => {
    const componentFixture = renderComponent(EventSubstitutionComponent, {
      event: createMatchEvent({
        type: 'subst',
        detail: 'Substitution',
        assist: { id: 11, name: 'Incoming' },
      }),
    });

    expect(readElementTexts(componentFixture.nativeElement, 'span')).toEqual([
      'Incoming',
      'Scorer',
    ]);

    componentFixture.componentRef.setInput(
      'event',
      createMatchEvent({
        player: { id: 20, name: 'Outgoing' },
        assist: { id: 21, name: 'Replacement' },
      })
    );
    componentFixture.detectChanges();

    expect(readElementTexts(componentFixture.nativeElement, 'span')).toEqual([
      'Replacement',
      'Outgoing',
    ]);
  });
});
