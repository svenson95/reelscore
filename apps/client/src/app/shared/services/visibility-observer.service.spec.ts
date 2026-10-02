import { TestBed } from '@angular/core/testing';

import { LiveRefreshService } from './live-refresh/live-refresh.service';

import { VisibilityObserverService } from './visibility-observer.service';

describe(VisibilityObserverService.name, () => {
  let service: VisibilityObserverService;
  let isEnabled: jest.Mock;
  let refresh: jest.Mock;
  let hidden = false;
  let hiddenProperty: jest.SpyInstance;

  beforeEach(() => {
    hidden = false;
    hiddenProperty = jest
      .spyOn(document, 'hidden', 'get')
      .mockImplementation(() => hidden);

    isEnabled = jest.fn().mockReturnValue(false);
    refresh = jest.fn().mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        VisibilityObserverService,
        {
          provide: LiveRefreshService,
          useValue: { isEnabled, refresh },
        },
      ],
    });

    service = TestBed.inject(VisibilityObserverService);
  });

  afterEach(() => {
    service.stop();
    hiddenProperty.mockRestore();
  });

  it('refreshes only when visible and enabled, and stops observing on request', () => {
    service.init();
    service.init();
    document.dispatchEvent(new Event('visibilitychange'));

    expect(isEnabled).toHaveBeenCalledTimes(1);
    expect(refresh).not.toHaveBeenCalled();

    isEnabled.mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange'));

    expect(refresh).toHaveBeenCalledWith({ force: true });

    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));

    expect(isEnabled).toHaveBeenCalledTimes(2);
    expect(refresh).toHaveBeenCalledTimes(1);

    hidden = false;
    service.stop();
    document.dispatchEvent(new Event('visibilitychange'));

    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
