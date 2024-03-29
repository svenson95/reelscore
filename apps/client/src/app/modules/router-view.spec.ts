import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  CompetitionName,
  LEAGUES_METADATA,
  LEAGUES_URLS,
  LeagueUrl,
  STANDING_LEAGUES_IDS,
} from '../constants';

import { routes } from '../app.routes';
import { LeagueComponent } from './league/league.component';

describe('RouterView', () => {
  let fixture: ComponentFixture<LeagueComponent>;
  let component: LeagueComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueComponent, RouterTestingModule.withRoutes(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('getLeagueByUrl', () => {
    it('should return league if input is valid', () => {
      // given
      const validData = LEAGUES_METADATA[2];

      // when
      const league = component.getLeagueByUrl(validData.url as LeagueUrl);

      // then
      expect(league).not.toBeUndefined();
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

  describe('updateLeagueOnRouting', () => {
    it('should update selected league after routing', () => {
      // given
      const mock = CompetitionName.ENGLAND_PREMIER_LEAGUE;
      const validRoute = LEAGUES_URLS[mock] as LeagueUrl;
      const validMetaData = LEAGUES_METADATA.find(
        (m) => m.id === STANDING_LEAGUES_IDS[mock]
      );
      expect(component.selectedLeague()).toBe(undefined);
      jest.spyOn(component, 'updateLeague');

      // when
      component.updateLeague(validRoute);

      // then
      expect(component.updateLeague).toHaveBeenCalledWith(validRoute);
      expect(component.selectedLeague()).toBe(validMetaData);
    });
  });
});
