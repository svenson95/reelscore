import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RefreshRegistryService, type RefreshTarget } from '@app/shared';
import type { GetFixtureDTO } from '@lib/models';
import { EXAMPLE_FIXTURE } from '../../../../testing/fixtures.mock';

import { MatchFacade } from '../match.facade';

import { MatchRefreshService } from './match-refresh.service';

describe('MatchRefreshService', () => {
  const fixture = signal<GetFixtureDTO | null>(null);
  const isLoading = signal(false);
  const isRefreshing = signal(false);

  const facadeMock = {
    fixture,
    isLoading,
    isRefreshing,
    reloadFixture: jest.fn<Promise<void>, []>(),
  };

  let registeredTarget: RefreshTarget | undefined;
  const unregister = jest.fn();
  const refreshRegistryMock = {
    register: jest.fn((target: RefreshTarget): (() => void) => {
      registeredTarget = target;
      return unregister;
    }),
  };

  let service: MatchRefreshService;

  beforeEach(() => {
    fixture.set(null);
    isLoading.set(false);
    isRefreshing.set(false);
    registeredTarget = undefined;
    jest.clearAllMocks();
    facadeMock.reloadFixture.mockResolvedValue();

    TestBed.configureTestingModule({
      providers: [
        MatchRefreshService,
        { provide: MatchFacade, useValue: facadeMock },
        { provide: RefreshRegistryService, useValue: refreshRegistryMock },
      ],
    });

    service = TestBed.inject(MatchRefreshService);
  });

  it('should register a reactive refresh target for the match', async () => {
    service.init(42);

    expect(registeredTarget?.id).toBe('match:42');
    expect(registeredTarget?.isLive()).toBe(false);
    expect(registeredTarget?.canRefresh()).toBe(true);

    fixture.set(createFixture('1H'));

    expect(registeredTarget?.isLive()).toBe(true);

    isLoading.set(true);

    expect(registeredTarget?.canRefresh()).toBe(false);

    isLoading.set(false);
    isRefreshing.set(true);

    expect(registeredTarget?.canRefresh()).toBe(false);

    await registeredTarget?.refresh();

    expect(facadeMock.reloadFixture).toHaveBeenCalledTimes(1);
  });

  it('should replace the previous registration when the fixture changes', () => {
    service.init(42);
    service.init(84);

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(registeredTarget?.id).toBe('match:84');
  });

  it('should unregister the refresh target on destroy', () => {
    service.init(42);

    service.destroy();
    service.destroy();

    expect(unregister).toHaveBeenCalledTimes(1);
  });
});

function createFixture(status: '1H' | 'FT'): GetFixtureDTO {
  return {
    data: {
      ...EXAMPLE_FIXTURE,
      fixture: {
        ...EXAMPLE_FIXTURE.fixture,
        status: {
          ...EXAMPLE_FIXTURE.fixture.status,
          short: status,
        },
      },
    },
    highlights: [],
  };
}
