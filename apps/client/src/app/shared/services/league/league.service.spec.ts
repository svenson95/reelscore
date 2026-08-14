import { TestBed } from '@angular/core/testing';

import { SELECT_COMPETITION_DATA } from '../../constants';

import { LEAGUE_SERVICE_PROVIDER, LeagueService } from './league.service';

describe('LeagueService', () => {
  let service: LeagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LEAGUE_SERVICE_PROVIDER],
    });

    service = TestBed.inject(LeagueService);
  });

  it('should set selectedLeague properly', () => {
    // Arrange
    const mockLeague = SELECT_COMPETITION_DATA[2].competitions[0];

    expect(service.selectedLeague()).toBeUndefined();

    // Act
    service.setSelectedLeague(mockLeague);

    // Assert
    expect(service.selectedLeague()).toEqual(mockLeague);
  });
});
