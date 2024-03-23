import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LeagueService, MockLeagueService, mockLeague } from '../../services';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let leagueService: LeagueService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: LeagueService, useClass: MockLeagueService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    leagueService = TestBed.inject(LeagueService);
    fixture.detectChanges();
  });

  /* Class Tests */
  it('should display progress bar while loading', () => {
    const component = fixture.componentInstance;
    expect(component.progressMode())
      .withContext('off at first')
      .toBe('determinate');

    component.isLoading.set(true);
    expect(component.progressMode())
      .withContext('on loading')
      .toBe('indeterminate');

    component.isLoading.set(false);
    expect(component.progressMode())
      .withContext('off after loading')
      .toBe('determinate');
  });

  it('should set selectedLeague to undefined on logo click', () => {
    leagueService.selectedLeague.set(mockLeague);
    expect(leagueService.selectedLeague()).toBe(mockLeague);

    const debugElement = fixture.debugElement;
    const logo = debugElement.query(By.css('futbet-logo'));
    logo.triggerEventHandler('click', null);

    expect(leagueService.selectedLeague()).toBe(undefined);
  });

  /* DOM Tests */
  it(`should display 'futbet' logo`, () => {
    const debugElement = fixture.debugElement;
    const logo = debugElement.query(By.css('futbet-logo'));

    expect(logo).toBeTruthy();
    expect(logo.nativeElement.textContent).toEqual('futbet');
  });
});
