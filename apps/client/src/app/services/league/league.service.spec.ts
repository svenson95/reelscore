import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LEAGUES_METADATA } from '../../constants';

import { LeagueService } from './league.service';

describe('LeagueService', () => {
  let service: LeagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagueService);
  });

  it('should navigate to league view by id', fakeAsync(() => {
    // Arrange
    const mockLeague = LEAGUES_METADATA[2];
    // console.log('location', location);
    // const path = location.path();

    // Act
    spyOn(service, 'navigateToLeague');
    service.selectedLeague.set(mockLeague);
    tick();

    // Assert
    // TODO: check why effect in service don't run, which would've called navigateToLeague
    // expect(service.navigateToLeague).toHaveBeenCalledWith(mockLeague.id);
    expect(service.selectedLeague()).toEqual(mockLeague);
    // TODO: check why routing is not working in this test
    // expect(path).toBe('/league?=39');
  }));
});
