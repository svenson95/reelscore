import { TestBed } from '@angular/core/testing';

import {
  renderComponent,
  readElementText,
} from '../../../../../../../../testing/match-components.testing';
import { EXAMPLE_FIXTURE } from '../../../../../../../../testing/fixtures.mock';

import { MatchInfoTeamComponent } from './match-info-team.component';

describe('MatchInfoTeamComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatchInfoTeamComponent] });
  });

  it('replaces loading placeholders with the team name and accessible logo, and resets on removal', () => {
    const componentFixture = renderComponent(MatchInfoTeamComponent, {
      team: null,
    });

    expect(
      componentFixture.nativeElement.querySelectorAll('.rs-skeleton')
    ).toHaveLength(2);

    componentFixture.componentRef.setInput('team', EXAMPLE_FIXTURE.teams.away);
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Arsenal'
    );
    expect(componentFixture.nativeElement.querySelector('img').alt).toBe(
      'Arsenal logo'
    );
    expect(
      componentFixture.nativeElement.querySelector('img').getAttribute('src')
    ).toContain('42');
    expect(
      componentFixture.nativeElement.querySelector('.rs-skeleton')
    ).toBeNull();

    componentFixture.componentRef.setInput('team', null);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelectorAll('.rs-skeleton')
    ).toHaveLength(2);
  });
});
