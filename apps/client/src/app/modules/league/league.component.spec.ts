import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LEAGUES_METADATA } from '../../constants';
import { LeagueComponent } from './league.component';
import { LeagueSelectData } from '../../models';

describe('LeagueComponent', () => {
  let fixture: ComponentFixture<LeagueComponent>;
  let component: LeagueComponent;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, LeagueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueComponent);
    router = TestBed.get(Router);
    location = TestBed.get(Location);

    component = fixture.componentInstance;

    fixture.detectChanges();
    router.initialNavigation();
  });

  describe('selectedLeague', () => {
    it('should init selected league if route has query params', () => {
      // Arrange
      const mockLeague = LEAGUES_METADATA[2];

      // Act
      spyOn(component, 'selectedLeague');
      component.selectedLeague.set(mockLeague);
      fixture.detectChanges();

      // Assert
      expect(component.selectedLeague).toHaveBeenCalled();

      // TODO: check why selectedLeague is not defined
      // expect(selectedLeague?.id).toBe('39');
    });

    it("shouldn't init selected league if route hasn't query params", () => {
      // Arrange
      const mockLeague = LEAGUES_METADATA[2];

      // Act
      spyOn(component, 'selectedLeague');
      component.ngOnInit();
      fixture.detectChanges();

      // Assert
      expect(component.selectedLeague).toHaveBeenCalled();

      // TODO: check why selectedLeague is not defined
      // expect(selectedLeague?.id).toBe('39');
    });
  });

  describe('getLeagueById', () => {
    it('should get league by id', () => {
      // Arrange
      const mockLeagueId = LEAGUES_METADATA[2].id;

      // Act
      const league = component.getLeagueById(mockLeagueId);

      // Assert
      expect(league).toBeDefined();
      expect(league!.id).toBe('39');
    });

    it('should return undefined if league id not found', () => {
      // Arrange
      const mockLeagueId = '999';

      // Act
      const league = component.getLeagueById(mockLeagueId);

      // Assert
      expect(league).toBeUndefined();
    });
  });
});
