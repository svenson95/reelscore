import { Location } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { routes } from '../../app.routes';
import { LeagueService, mockLeague } from '../../services';

import { HeaderComponent, SELECTED_LEAGUE_DEFAULT } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let leagueService: LeagueService;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), HeaderComponent],
      providers: [LeagueService],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    leagueService = TestBed.inject(LeagueService);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  /* Class Tests */
  it('should set form control properly', fakeAsync(() => {
    // given
    expect(component.leagueControl.value).toBe(SELECTED_LEAGUE_DEFAULT);

    // when
    leagueService.setSelectedLeague(mockLeague);
    tick();

    // then
    expect(component.leagueControl.value).toBe(mockLeague.url);
  }));

  /* DOM Tests */
  it(`should display 'futbet' logo`, () => {
    // given
    const debugElement = fixture.debugElement;

    // when
    const logo = debugElement.query(By.css('futbet-logo'));

    // then
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.textContent).toEqual('FUT⚽BET');
  });

  it('should route to start on logo-toggle click', fakeAsync(() => {
    // given
    const initPath = '/leagues/' + mockLeague.url;
    location.go(initPath);
    expect(location.path()).toEqual(initPath);

    // when
    const button = fixture.debugElement.query(By.css(`.logo-toggle`));
    button.nativeElement.click();
    tick();

    // then
    expect(location.path()).toEqual('/');
  }));

  it('should route to league on league-toggle click', fakeAsync(() => {
    // given
    expect(location.path()).toEqual('');

    // when
    const button = fixture.debugElement.query(By.css(`.${mockLeague.url}`));
    button.nativeElement.click();
    tick();

    // then
    expect(location.path()).toEqual('/leagues/' + mockLeague.url);
  }));
});
