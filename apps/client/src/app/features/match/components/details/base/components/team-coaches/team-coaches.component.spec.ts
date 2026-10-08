import { TestBed } from '@angular/core/testing';

import type { TeamCoachDTO } from '@reelscore-sdk/models';

import {
  EXAMPLE_FIXTURE,
  readElementText,
  renderComponent,
} from '@testing/client';

import { MatchTeamCoachesComponent } from './team-coaches.component';

describe(MatchTeamCoachesComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchTeamCoachesComponent],
    });
  });

  it('shows loading placeholders for both teams', () => {
    const componentFixture = renderComponent(MatchTeamCoachesComponent, {
      fixture: EXAMPLE_FIXTURE,
      coaches: [],
      isLoading: true,
    });

    const rootElement = componentFixture.nativeElement as HTMLElement;

    expect(rootElement.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(rootElement.querySelectorAll('.coach-loading')).toHaveLength(2);
    expect(rootElement.querySelectorAll('.loading-photo')).toHaveLength(2);
  });

  it('shows current coaches and formatted dates for their teams', () => {
    const coach = createCoach(85, '2024-03-06');
    const componentFixture = renderComponent(MatchTeamCoachesComponent, {
      fixture: EXAMPLE_FIXTURE,
      coaches: [coach],
      isLoading: false,
    });

    const rootElement = componentFixture.nativeElement as HTMLElement;
    const renderedText = readElementText(rootElement);

    expect(renderedText).toContain('Alex Manager');
    expect(renderedText).toContain('45 Jahre');
    expect(renderedText).toContain('🇩🇪 Deutschland');
    expect(renderedText).toContain('Im Amt seit 06.03.2024');
    expect(rootElement.querySelectorAll('.team-card')).toHaveLength(2);
    expect(rootElement.querySelectorAll('.coach')).toHaveLength(1);
    expect(rootElement.querySelector('.coach-away')).not.toBeNull();
  });

  it('shows the error state for teams without coach data', () => {
    const componentFixture = renderComponent(MatchTeamCoachesComponent, {
      fixture: EXAMPLE_FIXTURE,
      coaches: [],
      isLoading: false,
      error: new Error('Request failed'),
    });

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Trainer konnten nicht geladen werden.'
    );
  });

  it('shows the empty state when the fixture is unavailable', () => {
    const componentFixture = renderComponent(MatchTeamCoachesComponent, {
      fixture: null,
      coaches: [],
      isLoading: false,
    });

    expect(
      componentFixture.nativeElement.querySelector('.team-card')
    ).toBeNull();
  });
});

function createCoach(teamId: number, startDate: string): TeamCoachDTO {
  const team = {
    id: teamId,
    name: 'Paris Saint Germain',
    logo: 'coach-team.png',
  };

  return {
    id: 100,
    name: 'Coach',
    firstname: 'Alex',
    lastname: 'Manager',
    age: 45,
    birth: { date: '1980-05-04', place: 'Berlin', country: 'Germany' },
    nationality: 'Germany',
    height: '180 cm',
    weight: '75 kg',
    photo: 'coach.png',
    team,
    career: [{ team, start: startDate, end: null }],
  };
}
