import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  EXAMPLE_FIXTURE,
  readElementText,
  renderComponent,
} from '@testing/client';

import { MatchFixturesTableComponent } from './fixtures-table.component';

describe('MatchFixturesTableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchFixturesTableComponent],
      providers: [provideRouter([])],
    });
  });

  it('renders match links, marks the related team and distinguishes wins from losses', () => {
    const componentFixture = renderComponent(MatchFixturesTableComponent, {
      fixtures: [EXAMPLE_FIXTURE],
      team: EXAMPLE_FIXTURE.teams.home,
    });
    const link = componentFixture.nativeElement.querySelector('a');

    expect(link.getAttribute('href')).toContain(
      String(EXAMPLE_FIXTURE.fixture.id)
    );
    expect(link.classList.contains('is-winner')).toBe(true);
    expect(
      componentFixture.nativeElement.querySelector('.home .is-related')
    ).not.toBeNull();

    componentFixture.componentRef.setInput('team', EXAMPLE_FIXTURE.teams.away);
    componentFixture.detectChanges();

    expect(link.classList.contains('is-loser')).toBe(true);
    expect(link.classList.contains('is-winner')).toBe(false);
    expect(
      componentFixture.nativeElement.querySelector('.home .is-related')
    ).toBeNull();

    componentFixture.componentRef.setInput('fixtures', []);
    componentFixture.detectChanges();

    expect(componentFixture.nativeElement.querySelector('a')).toBeNull();
    expect(readElementText(componentFixture.nativeElement)).toBe(
      'Keine Spiele gefunden'
    );
  });
});
