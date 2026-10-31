import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  FooterComponent,
  HeaderComponent,
  RealtimeUpdateService,
  SeoService,
} from './core';
import {
  RealtimeService,
  StartupService,
  VisibilityObserverService,
} from './shared';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  const startupServiceMock = {
    routeActivated: false,
    hideAppInitializer: jest.fn(),
    removeAppInitializerElement: jest.fn(),
  };

  const realtimeServiceMock = {
    init: jest.fn(),
  };

  const realtimeUpdateServiceMock = {
    init: jest.fn(),
  };

  const seoServiceMock = {
    init: jest.fn(),
  };

  const visibilityObserverServiceMock = {
    init: jest.fn(),
  };

  beforeEach(async () => {
    startupServiceMock.routeActivated = false;
    startupServiceMock.hideAppInitializer.mockClear();

    realtimeServiceMock.init.mockClear();
    realtimeUpdateServiceMock.init.mockClear();
    seoServiceMock.init.mockClear();
    visibilityObserverServiceMock.init.mockClear();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: SeoService,
          useValue: seoServiceMock,
        },
        {
          provide: StartupService,
          useValue: startupServiceMock,
        },
        {
          provide: RealtimeService,
          useValue: realtimeServiceMock,
        },
        {
          provide: VisibilityObserverService,
          useValue: visibilityObserverServiceMock,
        },
      ],
    })
      .overrideComponent(AppComponent, {
        remove: {
          imports: [HeaderComponent, FooterComponent],
          providers: [RealtimeUpdateService],
        },
        add: {
          providers: [
            {
              provide: RealtimeUpdateService,
              useValue: realtimeUpdateServiceMock,
            },
          ],
        },
      })
      .compileComponents();

    component = TestBed.createComponent(AppComponent).componentInstance;
  });

  describe('initialization', () => {
    it('should initialize realtime updates, realtime and observe visibility', () => {
      component.ngOnInit();

      expect(realtimeUpdateServiceMock.init).toHaveBeenCalledTimes(1);
      expect(realtimeServiceMock.init).toHaveBeenCalledTimes(1);
      expect(visibilityObserverServiceMock.init).toHaveBeenCalledTimes(1);
    });

    it('should initialize realtime updates before connecting realtime', () => {
      component.ngOnInit();

      const realtimeUpdateOrder =
        realtimeUpdateServiceMock.init.mock.invocationCallOrder[0];

      const realtimeInitializationOrder =
        realtimeServiceMock.init.mock.invocationCallOrder[0];

      expect(realtimeUpdateOrder).toBeLessThan(realtimeInitializationOrder);
    });

    it('should initialize SEO metadata synchronization', () => {
      component.ngOnInit();

      expect(seoServiceMock.init).toHaveBeenCalledTimes(1);
    });
  });

  describe('route activation', () => {
    it('should hide app initializer only after first route activation', () => {
      component.onRouteActivated();
      component.onRouteActivated();

      expect(startupServiceMock.routeActivated).toBe(true);
      expect(startupServiceMock.hideAppInitializer).toHaveBeenCalledTimes(1);
    });
  });
});
