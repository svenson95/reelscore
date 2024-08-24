import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SELECT_COMPETITION_DATA } from '@lib/constants';
import { LeagueService } from './league.service';

describe('LeagueService', () => {
  let service: LeagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagueService);
  });

  it('should set selectedLeague properly', fakeAsync(() => {
    // given
    expect(service.selectedLeague()).toEqual(undefined);
    const mockLeague = SELECT_COMPETITION_DATA[2];

    // when
    jest.spyOn(service, 'setSelectedLeague');
    service.setSelectedLeague(mockLeague);
    tick();

    // then
    expect(service.setSelectedLeague).toHaveBeenCalledWith(mockLeague);
    expect(service.selectedLeague()).toEqual(mockLeague);
  }));
});
