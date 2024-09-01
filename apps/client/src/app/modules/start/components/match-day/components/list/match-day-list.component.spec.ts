import { Location } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { routes } from '../../../../../../app.routes';
import { MatchDayListComponent } from './match-day-list.component';

describe('MatchDayListComponent', () => {
  let fixture: ComponentFixture<MatchDayListComponent>;
  let component: MatchDayListComponent;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), MatchDayListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchDayListComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  // DOM Tests
  it('should display li elements for a competition', () => {
    // given
    // const mock = MATCH_EXAMPLES;
    // component.competition().fixtures = mock;
    // // when
    // fixture.detectChanges();
    // const homeTeams = fixture.debugElement.queryAll(By.css('.home-team'));
    // const awayTeams = fixture.debugElement.queryAll(By.css('.away-team'));
    // // then
    // expect(homeTeams[0].nativeElement.textContent).toBe(
    //   MATCH_EXAMPLES[0].homeTeam
    // );
    // expect(awayTeams[1].nativeElement.textContent).toBe(
    //   MATCH_EXAMPLES[1].awayTeam
    // );
    // expect(awayTeams[2].nativeElement.textContent).not.toBe(
    //   MATCH_EXAMPLES[3].awayTeam
    // );
    // expect(homeTeams[3].nativeElement.textContent).toBe(
    //   MATCH_EXAMPLES[3].homeTeam
    // );
  });

  it('should display no games label if list is empty', () => {
    // given
    // const mock = [] as Match[];
    // component.competition().fixtures = mock;
    // // when
    // fixture.detectChanges();
    // const noGamesLabel = fixture.debugElement.query(By.css('.is-empty'));
    // // then
    // expect(noGamesLabel).not.toBeUndefined();
    // expect(noGamesLabel.nativeElement.textContent).toBe(
    //   'Es finden keine Spiele statt.'
    // );
  });

  // TODO: add this test to CompetitionMatchDayComponent
  it('should display the competition with higher priority first', () => {
    // given
    // const mock = MATCH_EXAMPLES_2;
    // component.list.set(mock);
    // when
    // component.detectChanges();
    // const competitions = selectorAll(.league-container);
    // then
    // expect(competitions[0].priority).toBe("high");
    // expect(competitions[1].priority).toBe("mid");
    // expect(competitions[2].priority).toBe("low");
  });

  it('should navigate to match on click', fakeAsync(() => {
    // given
    // const mock = MATCH_EXAMPLES_2;
    // component.competition().fixtures = mock;
    // const listItems = fixture.debugElement.queryAll(By.css('li'));
    // expect(location.path()).toBe('');
    // // when
    // listItems[0].nativeElement.click();
    // tick();
    // // then
    // expect(location.path()).toEqual('/leagues/bundesliga/match/1');
  }));
});
