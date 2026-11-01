import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppUpdateService } from '../shared/data-access/app-update.service';
import { StartupService } from '../shared/data-access/startup/startup.service';

import { initializeApplication } from './app-initializer.provider';

describe('initializeApplication', () => {
  const appUpdateService = { init: jest.fn() };
  const startupService = {};
  const startupServiceFactory = jest.fn(() => startupService);

  beforeEach(() => {
    appUpdateService.init.mockClear();
    startupServiceFactory.mockClear();

    TestBed.configureTestingModule({
      providers: [
        { provide: AppUpdateService, useValue: appUpdateService },
        { provide: StartupService, useFactory: startupServiceFactory },
      ],
    });
  });

  it('initializes browser-only app updates in the browser', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' });

    TestBed.runInInjectionContext(initializeApplication);

    expect(startupServiceFactory).toHaveBeenCalledTimes(1);
    expect(appUpdateService.init).toHaveBeenCalledTimes(1);
  });

  it('skips browser-only app updates during server rendering', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

    TestBed.runInInjectionContext(initializeApplication);

    expect(startupServiceFactory).toHaveBeenCalledTimes(1);
    expect(appUpdateService.init).not.toHaveBeenCalled();
  });
});
