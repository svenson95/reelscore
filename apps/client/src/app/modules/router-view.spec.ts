import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CompetitionUrl } from '@lib/models';

import { routes } from '../app.routes';

import { OverviewComponent } from './overview/overview.component';

describe('RouterView', () => {
  let fixture: ComponentFixture<OverviewComponent>;
  let component: OverviewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponent, RouterTestingModule.withRoutes(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('getLeagueByUrl', () => {
    it('should return league if input is valid', () => {
      // given
      // const validData = SELECT_LEAGUE[2];
      // when
      // const league = component.getLeagueByUrl(validData.url as CompetitionUrl);
      // then
      // expect(league).not.toBeUndefined();
      // if (league) expect(league.image).toBe(validData.image);
      // if (league) expect(league.label).toBe(validData.label);
      // if (league) expect(league.id).toBe(validData.id);
      // if (league) expect(league.url).toBe(validData.url);
    });

    it('should return undefined if input is invalid', () => {
      // given
      const invalidUrl = 'url-with-typo' as CompetitionUrl;

      // when
      // const league = component.getLeagueByUrl(invalidUrl);

      // // then
      // expect(league).toBeUndefined();
    });
  });

  describe('updateLeagueOnRouting', () => {
    it('should update selected league after routing', () => {
      // given
      // const mock = CompetitionCode.ENGLAND_PREMIER_LEAGUE;
      // const validRoute = COMPETITION_URL[mock] as CompetitionUrl;
      // const validMetaData = SELECT_LEAGUE.find(
      //   (m) => m.id === COMPETITION_ID[mock]
      // );
      // expect(component.selectedLeague()).toBe(undefined);
      // jest.spyOn(component, 'updateLeague');
      // // when
      // component.updateLeague(validRoute);
      // // then
      // expect(component.updateLeague).toHaveBeenCalledWith(validRoute);
      // expect(component.selectedLeague()).toBe(validMetaData);
    });
  });
});
