import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LEAGUES_METADATA, LeagueUrl } from '../constants';

import { LeagueComponent } from './league/league.component';

describe('RouterView', () => {
  let fixture: ComponentFixture<LeagueComponent>;
  let component: LeagueComponent;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, LeagueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture.detectChanges();
    router.initialNavigation();
  });

  describe('selectedLeague', () => {
    // TODO:
    // it('should init selected league properly', () => {});
    // - if query params presented selectedLeague should be defined
    // - if query params not presented selectedLeague should be undefined
  });

  describe('getLeagueByUrl', () => {
    it('should return league if input is valid', () => {
      // given
      const validData = LEAGUES_METADATA[2];

      // when
      const league = component.getLeagueByUrl(validData.url as LeagueUrl);

      // then
      expect(league).toBeDefined();
      if (league) expect(league.image).toBe(validData.image);
      if (league) expect(league.label).toBe(validData.label);
      if (league) expect(league.id).toBe(validData.id);
      if (league) expect(league.flag).toBe(validData.flag);
      if (league) expect(league.url).toBe(validData.url);
    });

    it('should return undefined if input is invalid', () => {
      // given
      const invalidUrl = 'url-with-typo' as LeagueUrl;

      // when
      const league = component.getLeagueByUrl(invalidUrl);

      // then
      expect(league).toBeUndefined();
    });
  });
});
