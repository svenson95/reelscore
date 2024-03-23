import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LEAGUES_METADATA } from '../../../constants';
import { mockLeague } from '../../../services';

import { LeagueSelectorComponent } from './league-selector.component';

describe('LeagueSelectorComponent', () => {
  let fixture: ComponentFixture<LeagueSelectorComponent>;
  let component: LeagueSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueSelectorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  /* Class Tests */
  it('should set selected league', fakeAsync(() => {
    expect(component.selectedLeague())
      .withContext('undefined at first')
      .toEqual(undefined);

    component.setSelectedLeague(mockLeague);
    fixture.detectChanges();

    expect(component.selectedLeague()).toEqual(mockLeague);
  }));

  /* DOM Tests */
  it('should display all leagues', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.league-label'));
    expect(buttons.length).toBe(LEAGUES_METADATA.length);
    const label = (i: number) => buttons[i].nativeElement.textContent;
    expect(label(0)).toBe(LEAGUES_METADATA[0].label);
    expect(label(1)).toBe(LEAGUES_METADATA[1].label);
    expect(label(2)).toBe(LEAGUES_METADATA[2].label);
    expect(label(3)).toBe(LEAGUES_METADATA[3].label);
    expect(label(4)).toBe(LEAGUES_METADATA[4].label);
    expect(label(5)).toBe(LEAGUES_METADATA[5].label);
  });

  it('should select league on click', () => {
    const debugElement = fixture.debugElement;
    const leagueButton = debugElement.query(
      By.css(`mat-button-toggle[id="${mockLeague.id}"]`)
    );

    spyOn(component, 'setSelectedLeague');
    leagueButton.triggerEventHandler('click', null);

    expect(component.setSelectedLeague).toHaveBeenCalledWith(mockLeague);
  });
});
